<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\PublicationLog;
use App\Services\LinkedIn\LinkedInClient;
use App\Services\Llm\LlmManager;
use App\Services\Notify\FcmClient;
use App\Services\Scheduling\ScheduleCalculator;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke(Request $request, ScheduleCalculator $calc, LlmManager $llm, LinkedInClient $li, FcmClient $fcm)
    {
        $user = $request->user();
        $s = $user->settings;
        $now = CarbonImmutable::now();
        $articles = Article::where('user_id', $user->id);

        $linkedin = LinkedInController::statusFor($user, $li);

        $provider = $llm->provider($s->llm_provider);
        $generator = $provider->isConfigured()
            ? ['status' => 'ok', 'configured' => true, 'provider' => $provider->key(), 'message' => "Fournisseur {$provider->key()} ({$provider->model()})"]
            : ['status' => 'not_configured', 'configured' => false, 'provider' => $provider->key(), 'message' => "Fournisseur « {$provider->key()} » non configuré sur le serveur (clé d'API manquante)."];
        $lastGenFail = (clone $articles)->where('status', Article::GENERATION_FAILED)->where('updated_at', '>=', $now->subDay())->exists();
        if ($generator['configured'] && $lastGenFail) {
            $generator['status'] = 'warning';
            $generator['message'] = 'Échec de génération dans les dernières 24 heures.';
        }

        $beat = DB::table('system_heartbeats')->where('name', 'publishing')->value('last_run_at');
        $beatAt = $beat ? CarbonImmutable::parse($beat, 'UTC') : null;
        $healthy = $beatAt && $beatAt->gt($now->subMinutes(3));
        $scheduler = [
            'status' => $healthy ? 'ok' : 'error',
            'configured' => (bool) $beatAt,
            'last_tick_at' => $beatAt?->toIso8601String(),
            'message' => $healthy ? 'Ordonnanceur actif (exécution chaque minute).'
                : ($beatAt ? 'Ordonnanceur inactif depuis '.$beatAt->diffForHumans().' : vérifiez la tâche cron du serveur.'
                    : 'Ordonnanceur jamais exécuté : configurez la tâche cron du serveur.'),
        ];

        $next = $calc->nextSlot($s, $now);
        $nextArticle = $next ? (clone $articles)->whereDate('slot_date', $next->format('Y-m-d'))->first() : null;

        $weekStart = $calc->weekStart($s, $now)->utc();
        $stats = [
            'total_published' => (clone $articles)->where('status', Article::PUBLISHED)->count(),
            'published_this_week' => (clone $articles)->where('status', Article::PUBLISHED)->where('published_at', '>=', $weekStart)->count(),
            'failed_total' => (clone $articles)->whereIn('status', [Article::FAILED, Article::GENERATION_FAILED, Article::UNCERTAIN])->count(),
            'pending_review' => (clone $articles)->where('status', Article::NEEDS_REVIEW)->count(),
            'generated_total' => (clone $articles)->whereNotIn('status', [Article::GENERATING, Article::GENERATION_FAILED])->count(),
        ];
        $last = (clone $articles)->where('status', Article::PUBLISHED)->latest('published_at')->first();

        $errors = PublicationLog::where('user_id', $user->id)->whereIn('level', ['error', 'warning'])
            ->latest('created_at')->limit(8)->get()
            ->map(fn ($l) => ['at' => $l->created_at->toIso8601String(), 'level' => $l->level, 'message' => $l->message, 'article_id' => $l->article_id]);

        // Indicateur global : vert / orange / rouge
        $uncertain = (clone $articles)->where('status', Article::UNCERTAIN)->exists();
        $recentFail = (clone $articles)->where('status', Article::FAILED)->where('updated_at', '>=', $now->subDays(2))->exists();
        [$level, $message] = match (true) {
            ! $li->isConfigured() => ['red', "L'application LinkedIn n'est pas configurée sur le serveur."],
            in_array($linkedin['status'], ['not_connected', 'expired'], true) => ['red', $linkedin['message']],
            ! $healthy => ['red', $scheduler['message']],
            ! $generator['configured'] => ['red', $generator['message']],
            $recentFail || $uncertain => [$uncertain ? 'orange' : 'red', $uncertain ? 'Une publication demande une vérification.' : 'Échec de publication récent : consultez les articles.'],
            $stats['pending_review'] > 0 => ['orange', $stats['pending_review'].' article(s) en attente de validation.'],
            $linkedin['status'] === 'expiring' => ['orange', $linkedin['message']],
            $generator['status'] === 'warning' => ['orange', $generator['message']],
            default => ['green', 'Toutes les publications programmées sont prêtes.'],
        };

        return response()->json(['data' => [
            'status' => ['level' => $level, 'message' => $message],
            'linkedin' => $linkedin,
            'next_publication' => $next ? [
                'at' => $next->toIso8601String(), 'local_date' => $next->format('Y-m-d'), 'local_time' => $next->format('H:i'),
                'timezone' => $s->timezone, 'article_id' => $nextArticle?->id, 'article_status' => $nextArticle?->status,
                'article_title' => $nextArticle?->title,
            ] : null,
            'schedule' => ['time' => $s->publish_time, 'days' => $s->days(), 'timezone' => $s->timezone, 'mode' => $s->mode],
            'stats' => $stats,
            'last_publication' => $last ? ['article_id' => $last->id, 'title' => $last->title,
                'published_at' => $last->published_at?->toIso8601String(), 'linkedin_post_url' => $last->linkedinUrl()] : null,
            'generator' => $generator,
            'scheduler' => $scheduler,
            'push' => $fcm->clientConfigured()
                ? ['status' => 'ok', 'configured' => true, 'message' => 'Firebase Cloud Messaging actif.']
                : ['status' => 'warning', 'configured' => false, 'message' => 'Non configurées : l\'application vérifie les alertes toutes les 15 minutes.'],
            'recent_errors' => $errors,
        ]]);
    }
}
