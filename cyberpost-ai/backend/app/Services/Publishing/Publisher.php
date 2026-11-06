<?php

namespace App\Services\Publishing;

use App\Models\Article;
use App\Models\LinkedInAccount;
use App\Models\Publication;
use App\Services\LinkedIn\LinkedInClient;
use App\Services\LinkedIn\LinkedInException;
use App\Services\LinkedIn\PostResult;
use App\Services\Notify\ActivityLog;
use App\Services\Notify\Notifier;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Publication d'un article sur LinkedIn, avec garanties anti-doublon :
 *
 *  1. verrou applicatif (Cache::lock) par article ;
 *  2. réservation atomique en base (SELECT … FOR UPDATE) : une seule ligne
 *     publications par article (contrainte unique), passée en « publishing »
 *     avant tout appel réseau ;
 *  3. aucune nouvelle tentative automatique si LinkedIn a pu recevoir la
 *     requête (délai dépassé, 5xx, processus interrompu) : l'article passe en
 *     « uncertain » et une vérification humaine est demandée ;
 *  4. un article n'est déclaré publié que sur réponse HTTP 201 de LinkedIn.
 */
class Publisher
{
    public function __construct(
        private LinkedInClient $linkedin,
        private Notifier $notifier,
        private ActivityLog $log,
    ) {}

    public function publish(Article $article, string $trigger = 'scheduler', ?CarbonImmutable $now = null): PublishOutcome
    {
        $now ??= CarbonImmutable::now();
        $lock = Cache::lock('cyberpost:publish:article:'.$article->id, 180);
        if (! $lock->get()) {
            return new PublishOutcome(false, 'Une publication de cet article est déjà en cours.', 'locked');
        }
        try {
            $claim = $this->claim($article->id, $trigger, $now);
            if ($claim instanceof PublishOutcome) {
                return $claim;
            }
            [$article, $publication] = $claim;
            return $this->send($article, $publication, $trigger, $now);
        } finally {
            $lock->release();
        }
    }

    /** Réservation atomique. Renvoie [Article, Publication] ou un refus. */
    private function claim(int $articleId, string $trigger, CarbonImmutable $now): array|PublishOutcome
    {
        return DB::transaction(function () use ($articleId, $trigger, $now) {
            $article = Article::whereKey($articleId)->lockForUpdate()->first();
            if (! $article) {
                return new PublishOutcome(false, 'Article introuvable.', 'missing');
            }
            $allowed = $trigger === 'manual'
                ? [Article::APPROVED, Article::NEEDS_REVIEW, Article::FAILED, Article::RETRY_SCHEDULED]
                : [Article::APPROVED, Article::RETRY_SCHEDULED];
            if (! in_array($article->status, $allowed, true)) {
                return new PublishOutcome(false, match ($article->status) {
                    Article::PUBLISHED => 'Cet article est déjà publié.',
                    Article::PUBLISHING => 'Publication déjà en cours.',
                    Article::UNCERTAIN => 'Publication incertaine : vérifiez votre profil LinkedIn avant toute nouvelle tentative.',
                    Article::NEEDS_REVIEW => 'Article en attente de validation.',
                    default => 'Statut incompatible avec la publication : '.$article->status,
                }, 'status');
            }
            if (mb_strlen(trim($article->content)) < 50) {
                return new PublishOutcome(false, 'Contenu vide ou invalide.', 'invalid');
            }
            $pub = Publication::where('article_id', $article->id)->lockForUpdate()->first();
            if ($pub && in_array($pub->status, [Publication::PUBLISHED, Publication::PUBLISHING, Publication::UNCERTAIN], true)) {
                return new PublishOutcome(false, 'Une publication existe déjà pour cet article.', 'duplicate');
            }
            if ($pub && $trigger === 'scheduler' && $pub->next_attempt_at && $pub->next_attempt_at->gt($now)) {
                return new PublishOutcome(false, 'Prochaine tentative programmée plus tard.', 'wait');
            }
            // Jamais deux publications d'un même contenu (même texte publié par un autre article).
            if (Article::where('user_id', $article->user_id)->where('id', '!=', $article->id)
                ->where('status', Article::PUBLISHED)->where('content_hash', $article->content_hash)->exists()) {
                return new PublishOutcome(false, 'Un contenu identique a déjà été publié.', 'duplicate_content');
            }
            $pub ??= new Publication(['user_id' => $article->user_id, 'article_id' => $article->id, 'idempotency_key' => (string) Str::uuid()]);
            if ($trigger === 'manual') {
                $pub->attempts = 0; // relance manuelle : nouveau cycle de tentatives
            }
            $pub->fill(['status' => Publication::PUBLISHING, 'trigger' => $trigger, 'started_at' => now(), 'next_attempt_at' => null]);
            $pub->attempts = ($pub->attempts ?? 0) + 1;
            $pub->save();
            $article->update(['status' => Article::PUBLISHING, 'error' => null]);
            return [$article, $pub];
        });
    }

    private function send(Article $article, Publication $pub, string $trigger, CarbonImmutable $now): PublishOutcome
    {
        $user = $article->user;
        $account = LinkedInAccount::where('user_id', $user->id)->first();

        if (! $this->linkedin->isConfigured()) {
            return $this->fail($article, $pub, null, "L'application LinkedIn n'est pas configurée sur le serveur (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI).", 'config');
        }
        if (! $account) {
            return $this->fail($article, $pub, null, 'Aucun compte LinkedIn connecté.', 'not_connected');
        }
        // Renouvellement préventif si un jeton de rafraîchissement existe.
        if ($account->expires_at && $account->expires_at->lt(now()->addDay()) && $account->refresh_token) {
            try {
                $this->linkedin->refresh($account);
                $account->refresh();
            } catch (LinkedInException $e) {
                $this->log->warning($user, 'token_refresh_failed', $e->getMessage(), $article);
            }
        }
        if (! $account->isUsable()) {
            $account->update(['status' => 'expired']);
            $this->notifier->tokenExpired($user);
            return $this->fail($article, $pub, null, 'Jeton LinkedIn expiré : reconnectez votre compte depuis l\'application.', 'expired');
        }

        $result = $this->linkedin->createPost($account, $article->content, $article->hashtags ?? []);
        $this->log->info($user, 'linkedin_response', "Réponse LinkedIn : {$result->kind}".($result->status ? " (HTTP {$result->status})" : ''), $article,
            ['attempt' => $pub->attempts, 'trigger' => $trigger]);

        return match ($result->kind) {
            'created' => $this->success($article, $pub, $result, $now),
            'retryable' => $this->retryOrFail($article, $pub, $result, $trigger),
            'uncertain' => $this->uncertain($article, $pub, $result),
            'auth' => $this->authFailure($article, $pub, $account, $result),
            default => $this->fail($article, $pub, $result->status, $result->message, $result->kind),
        };
    }

    private function success(Article $article, Publication $pub, PostResult $r, CarbonImmutable $now): PublishOutcome
    {
        DB::transaction(function () use ($article, $pub, $r) {
            $pub->update(['status' => Publication::PUBLISHED, 'linkedin_post_urn' => $r->urn, 'http_status' => 201, 'published_at' => now(), 'last_error' => null]);
            $article->update(['status' => Article::PUBLISHED, 'published_at' => now(), 'linkedin_post_urn' => $r->urn, 'error' => null]);
        });
        $tz = $article->user->settings->timezone ?? config('cyberpost.default_timezone');
        $at = $now->setTimezone($tz)->format('H\hi');
        $this->log->success($article->user, 'published', "Article publié sur LinkedIn ({$r->urn}).", $article);
        $this->notifier->send($article->user, 'published', 'Publication réussie',
            "CyberPost AI : votre publication du jour a été publiée avec succès sur LinkedIn à $at.", 'success', $article, 'published:'.$article->id);
        return new PublishOutcome(true, "Publié sur LinkedIn à $at.", 'created');
    }

    private function retryOrFail(Article $article, Publication $pub, PostResult $r, string $trigger): PublishOutcome
    {
        $max = (int) config('cyberpost.publishing.max_attempts', 4);
        $delays = config('cyberpost.publishing.retry_delays_minutes', [2, 5, 10, 20]);
        if ($pub->attempts < $max) {
            $delay = $delays[min($pub->attempts - 1, count($delays) - 1)];
            $pub->update(['status' => Publication::RETRY_SCHEDULED, 'next_attempt_at' => now()->addMinutes($delay), 'http_status' => $r->status, 'last_error' => $r->message]);
            $article->update(['status' => Article::RETRY_SCHEDULED, 'error' => $r->message." Nouvelle tentative dans $delay min."]);
            $this->log->warning($article->user, 'publish_retry', $r->message." Tentative {$pub->attempts}/$max, prochaine dans $delay min.", $article);
            return new PublishOutcome(false, $r->message." Nouvelle tentative automatique dans $delay minutes.", 'retry');
        }
        return $this->fail($article, $pub, $r->status, $r->message." ($max tentatives effectuées)", 'retry_exhausted');
    }

    private function uncertain(Article $article, Publication $pub, PostResult $r): PublishOutcome
    {
        $pub->update(['status' => Publication::UNCERTAIN, 'http_status' => $r->status, 'last_error' => $r->message]);
        $article->update(['status' => Article::UNCERTAIN, 'error' => $r->message]);
        $this->log->error($article->user, 'publish_uncertain', $r->message, $article);
        $this->notifier->send($article->user, 'intervention', 'Vérification nécessaire',
            "La réponse de LinkedIn est incertaine pour « {$article->title} ». Vérifiez votre profil : aucune nouvelle tentative ne sera faite automatiquement afin d'éviter un doublon.",
            'warning', $article, 'uncertain:'.$article->id);
        return new PublishOutcome(false, $r->message.' Vérifiez votre profil LinkedIn.', 'uncertain');
    }

    private function authFailure(Article $article, Publication $pub, LinkedInAccount $account, PostResult $r): PublishOutcome
    {
        $account->update(['status' => 'expired', 'last_error' => $r->message]);
        $this->notifier->tokenExpired($article->user);
        return $this->fail($article, $pub, 401, $r->message, 'auth');
    }

    private function fail(Article $article, Publication $pub, ?int $status, string $message, string $code): PublishOutcome
    {
        // La requête n'a pas créé de post : la ligne passe en échec, une relance manuelle reste possible.
        $pub->update(['status' => Publication::FAILED, 'http_status' => $status, 'last_error' => $message]);
        $article->update(['status' => Article::FAILED, 'error' => $message]);
        $this->log->error($article->user, 'publish_failed', $message, $article, ['code' => $code]);
        $this->notifier->send($article->user, 'publish_failed', 'Échec de publication',
            "La publication « {$article->title} » a échoué : $message", 'error', $article, 'failed:'.$article->id.':'.$pub->attempts.':'.$code);
        return new PublishOutcome(false, $message, $code);
    }

    /** Publication restée « publishing » (processus interrompu) : passe en incertain, jamais de renvoi. */
    public function recoverStale(): int
    {
        $limit = now()->subMinutes((int) config('cyberpost.publishing.stale_publishing_minutes', 10));
        $n = 0;
        Publication::where('status', Publication::PUBLISHING)->where('started_at', '<', $limit)->with('article.user')->get()
            ->each(function (Publication $p) use (&$n) {
                $msg = 'Publication interrompue avant la réponse de LinkedIn : le post a peut-être été créé.';
                $this->uncertain($p->article, $p, new PostResult('uncertain', null, null, $msg));
                $n++;
            });
        return $n;
    }

    /** Résolution manuelle d'une publication incertaine. */
    public function resolve(Article $article, bool $published, ?string $postUrl): PublishOutcome
    {
        if ($article->status !== Article::UNCERTAIN) {
            return new PublishOutcome(false, "Cet article n'est pas en vérification.", 'status');
        }
        $pub = $article->publication;
        if ($published) {
            $urn = null;
            if ($postUrl && preg_match('/urn:li:(?:share|ugcPost|activity):\d+/', urldecode($postUrl), $m)) {
                $urn = $m[0];
            }
            $pub?->update(['status' => Publication::PUBLISHED, 'linkedin_post_urn' => $urn, 'published_at' => now(), 'last_error' => null]);
            $article->update(['status' => Article::PUBLISHED, 'published_at' => $pub?->started_at ?? now(), 'linkedin_post_urn' => $urn, 'error' => null]);
            $this->log->info($article->user, 'resolved_published', 'Publication confirmée manuellement.', $article);
            return new PublishOutcome(true, 'Publication confirmée.', 'resolved');
        }
        $pub?->update(['status' => Publication::FAILED, 'last_error' => 'Absence de publication confirmée manuellement.']);
        $article->update(['status' => Article::FAILED, 'error' => 'Non publié (vérifié manuellement). Vous pouvez relancer la publication.']);
        $this->log->info($article->user, 'resolved_not_published', 'Absence de publication confirmée manuellement.', $article);
        return new PublishOutcome(true, 'Article marqué comme non publié : vous pouvez le republier.', 'resolved');
    }
}
