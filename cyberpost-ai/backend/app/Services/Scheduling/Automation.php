<?php

namespace App\Services\Scheduling;

use App\Models\Article;
use App\Models\LinkedInAccount;
use App\Models\Publication;
use App\Models\User;
use App\Services\Content\ArticleGenerator;
use App\Services\LinkedIn\LinkedInClient;
use App\Services\Llm\LlmException;
use App\Services\Notify\ActivityLog;
use App\Services\Notify\Notifier;
use App\Services\Publishing\Publisher;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Orchestration exécutée par l'ordonnanceur du serveur (cron, chaque minute).
 * Indépendante du téléphone : fonctionne application fermée ou téléphone éteint.
 */
class Automation
{
    public function __construct(
        private ScheduleCalculator $calc,
        private ArticleGenerator $generator,
        private Publisher $publisher,
        private Notifier $notifier,
        private ActivityLog $log,
        private LinkedInClient $linkedin,
    ) {}

    private function users()
    {
        return User::where('role', User::ROLE_OWNER)->whereHas('settings')->with('settings')->get();
    }

    // ------------------------------------------------------------------ génération

    public function runGeneration(CarbonImmutable $now): array
    {
        $report = [];
        foreach ($this->users() as $user) {
            $s = $user->settings;
            $slot = $this->calc->slotNeedingGeneration($s, $now);
            if ($slot) {
                $report[] = $this->ensureSlotArticle($user, $slot, $now);
            }
        }
        // Reprises des générations échouées (articles à la demande ou de créneau)
        Article::where('status', Article::GENERATION_FAILED)->whereNotNull('next_generation_at')
            ->where('next_generation_at', '<=', $now)->with('user.settings')->get()
            ->each(function (Article $a) use (&$report, $now) {
                if ($a->scheduled_for && $a->scheduled_for->lt($now->subMinutes($a->user->settings->catch_up_window_minutes))) {
                    $a->update(['next_generation_at' => null]);
                    return;
                }
                $report[] = $this->generate($a, null, $now);
            });
        $this->heartbeat('generation', $now);
        return array_filter($report);
    }

    private function ensureSlotArticle(User $user, CarbonImmutable $slot, CarbonImmutable $now): ?string
    {
        $date = $slot->format('Y-m-d');
        if (Article::where('user_id', $user->id)->whereDate('slot_date', $date)->exists()) {
            return null;
        }
        try {
            // La contrainte unique (user_id, slot_date) empêche deux articles pour le même jour,
            // même si deux processus s'exécutent simultanément.
            $article = Article::create([
                'user_id' => $user->id, 'title' => 'Article du '.$slot->translatedFormat('l j F'),
                'status' => Article::GENERATING, 'slot_date' => $date, 'scheduled_for' => $slot->utc(),
                'language' => $user->settings->language,
            ]);
        } catch (QueryException $e) {
            return null;
        }
        $this->log->info($user, 'generation_started', "Génération de l'article du $date.", $article);
        return $this->generate($article, null, $now);
    }

    /** Génère le contenu d'un article ; gère les reprises en cas d'erreur temporaire. */
    public function generate(Article $article, ?string $category, CarbonImmutable $now): string
    {
        $user = $article->user;
        $article->update(['status' => Article::GENERATING, 'generation_attempts' => $article->generation_attempts + 1]);
        try {
            $article = $this->generator->fill($article->fresh(), $category);
        } catch (Throwable $e) {
            return $this->generationFailed($article->fresh(), $e, $now);
        }

        $issues = $article->status === Article::NEEDS_REVIEW && $article->quality_issues
            ? ' Points à vérifier : '.implode(' ', array_slice($article->quality_issues, 0, 2)) : '';
        $this->log->success($user, 'generated', "Article généré : {$article->title} (score {$article->quality_score}).", $article);

        $tz = $user->settings->timezone;
        $when = $article->scheduled_for ? CarbonImmutable::parse($article->scheduled_for)->setTimezone($tz)->translatedFormat('l j F \à H\hi') : null;
        if ($article->status === Article::APPROVED && $when) {
            $this->notifier->send($user, 'scheduled', 'Publication programmée',
                "« {$article->title} » est prêt et sera publié $when.", 'info', $article, 'scheduled:'.$article->id);
        } elseif ($article->status === Article::NEEDS_REVIEW) {
            $this->notifier->send($user, 'intervention', 'Article à valider',
                "« {$article->title} » attend votre validation".($when ? " avant $when" : '').'.'.$issues, 'warning', $article, 'review:'.$article->id);
        } else {
            $this->notifier->send($user, 'generated', 'Article généré', "« {$article->title} » a été généré.", 'info', $article, 'generated:'.$article->id);
        }
        return "article {$article->id} : {$article->status}";
    }

    private function generationFailed(Article $article, Throwable $e, CarbonImmutable $now): string
    {
        $user = $article->user;
        $retryable = ! ($e instanceof LlmException) || $e->retryable;
        $max = (int) config('cyberpost.generation.max_attempts', 4);
        $deadline = $article->scheduled_for ? CarbonImmutable::parse($article->scheduled_for) : $now->addHours(2);
        $next = $now->addMinutes(5 * $article->generation_attempts);
        $canRetry = $retryable && $article->generation_attempts < $max && $next->lt($deadline->addMinutes($user->settings->catch_up_window_minutes));

        $article->update([
            'status' => Article::GENERATION_FAILED,
            'error' => 'Génération impossible : '.$e->getMessage(),
            'next_generation_at' => $canRetry ? $next : null,
        ]);
        $this->log->error($user, 'generation_failed', $e->getMessage(), $article, ['attempt' => $article->generation_attempts, 'retry' => $canRetry]);
        if (! $canRetry) {
            $this->notifier->send($user, 'generation_failed', 'Échec de génération',
                "L'article n'a pas pu être généré : {$e->getMessage()} Vérifiez la configuration du fournisseur de génération.",
                'error', $article, 'genfail:'.$article->id);
        }
        return "article {$article->id} : échec de génération";
    }

    // ------------------------------------------------------------------ publication

    public function runPublishing(CarbonImmutable $now): array
    {
        $report = [];
        $this->publisher->recoverStale();

        $due = Article::whereIn('status', [Article::APPROVED, Article::RETRY_SCHEDULED])
            ->whereNotNull('scheduled_for')->where('scheduled_for', '<=', $now)
            ->with('user.settings', 'publication')->orderBy('scheduled_for')->get();

        foreach ($due as $article) {
            $window = $article->user->settings->catch_up_window_minutes;
            $missed = $article->scheduled_for->lt($now->subMinutes($window));
            if ($missed && $article->status === Article::APPROVED) {
                $article->update(['status' => Article::NEEDS_REVIEW, 'error' => 'Créneau de publication manqué (serveur indisponible au moment prévu). Publiez-le manuellement ou reprogrammez-le.']);
                $this->notifier->send($article->user, 'intervention', 'Publication manquée',
                    "« {$article->title} » n'a pas pu être publié au créneau prévu. Intervention nécessaire.", 'warning', $article, 'missed:'.$article->id);
                continue;
            }
            $outcome = $this->publisher->publish($article, 'scheduler', $now);
            $report[] = "article {$article->id} : {$outcome->code} {$outcome->message}";
        }

        // Mode validation : rappel si l'article du créneau n'est pas validé à l'heure.
        Article::where('status', Article::NEEDS_REVIEW)->whereNotNull('slot_date')
            ->where('scheduled_for', '<=', $now)->where('scheduled_for', '>=', $now->subHours(12))->with('user')->get()
            ->each(fn ($a) => $this->notifier->send($a->user, 'intervention', 'Publication du jour en attente',
                "La publication du jour « {$a->title} » n'est pas encore validée : elle sera publiée dès votre validation (dans la fenêtre de rattrapage).",
                'warning', $a, 'pending:'.$a->id));

        $this->heartbeat('publishing', $now);
        return $report;
    }

    // ------------------------------------------------------------------ jetons LinkedIn

    public function checkTokens(): array
    {
        $report = [];
        $warnDays = (int) config('cyberpost.linkedin.expiry_warning_days', 7);
        foreach (LinkedInAccount::with('user')->where('status', 'connected')->get() as $acc) {
            if (! $acc->expires_at) {
                continue;
            }
            if ($acc->expires_at->isPast()) {
                if ($acc->refresh_token && rescue(fn () => $this->linkedin->refresh($acc), false, false)) {
                    $report[] = "compte {$acc->id} : jeton renouvelé";
                    continue;
                }
                $acc->update(['status' => 'expired']);
                $this->notifier->tokenExpired($acc->user);
                $report[] = "compte {$acc->id} : expiré";
            } elseif ($acc->expires_at->lt(now()->addDays($warnDays))) {
                if ($acc->refresh_token && rescue(fn () => $this->linkedin->refresh($acc), false, false)) {
                    $report[] = "compte {$acc->id} : jeton renouvelé";
                    continue;
                }
                if (! $acc->expiry_warned_at || $acc->expiry_warned_at->lt(now()->subDays(3))) {
                    $days = max(1, (int) ceil(now()->diffInHours($acc->expires_at) / 24));
                    $this->notifier->send($acc->user, 'token_expiring', 'Connexion LinkedIn à renouveler',
                        "Votre autorisation LinkedIn expire dans $days jour(s). Reconnectez votre compte depuis les paramètres pour éviter toute interruption.",
                        'warning', null, 'expiring:'.$acc->id.':'.now()->format('Y-m-d'));
                    $acc->update(['expiry_warned_at' => now()]);
                    $report[] = "compte {$acc->id} : avertissement envoyé";
                }
            }
        }
        $this->heartbeat('tokens', CarbonImmutable::now());
        return $report;
    }

    // ------------------------------------------------------------------ utilitaires

    /** Recalcule les créneaux des articles non publiés après un changement de paramètres. */
    public function reschedule(User $user): void
    {
        $s = $user->settings()->first();
        Article::where('user_id', $user->id)->whereNotNull('slot_date')
            ->whereIn('status', [Article::GENERATING, Article::APPROVED, Article::NEEDS_REVIEW, Article::GENERATION_FAILED, Article::RETRY_SCHEDULED])
            ->get()->each(function (Article $a) use ($s) {
                $slot = $this->calc->slotOn($s, CarbonImmutable::parse($a->slot_date->format('Y-m-d'), $s->timezone));
                if ($slot) {
                    $a->update(['scheduled_for' => $slot->utc()]);
                } else {
                    // Jour désactivé : l'article reste disponible, sans publication automatique.
                    $a->update(['scheduled_for' => null, 'slot_date' => null,
                        'status' => in_array($a->status, [Article::APPROVED, Article::RETRY_SCHEDULED], true) ? Article::NEEDS_REVIEW : $a->status]);
                }
            });
    }

    public function heartbeat(string $name, CarbonImmutable $now): void
    {
        DB::table('system_heartbeats')->upsert([['name' => $name, 'last_run_at' => now()->utc()]], ['name'], ['last_run_at']);
    }
}
