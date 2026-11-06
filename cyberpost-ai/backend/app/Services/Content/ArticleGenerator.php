<?php

namespace App\Services\Content;

use App\Models\ApplicationSetting;
use App\Models\Article;
use App\Models\EditorialCategory;
use App\Models\User;
use App\Services\Llm\LlmException;
use App\Services\Llm\LlmManager;
use App\Services\Notify\ActivityLog;
use App\Support\EditorialCatalog;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;

/**
 * Moteur de génération : choix du sujet, collecte des sources (actualité),
 * appel au modèle, contrôle qualité avec jusqu'à 2 réécritures guidées.
 *
 * Résultat : article en statut APPROVED (mode automatique et contrôle réussi)
 * ou NEEDS_REVIEW (mode validation, ou problèmes restants).
 */
class ArticleGenerator
{
    public function __construct(
        private LlmManager $llm,
        private TopicSelector $topics,
        private SourceCollector $sources,
        private PromptBuilder $prompts,
        private ArticleParser $parser,
        private QualityChecker $quality,
        private ActivityLog $log,
    ) {}

    /**
     * Génère (ou régénère) le contenu d'un article existant en statut GENERATING.
     * @throws LlmException si le fournisseur échoue (l'appelant décide de la reprise)
     */
    public function fill(Article $article, ?string $forcedCategory = null): Article
    {
        $user = $article->user;
        $s = $user->settings;
        $local = CarbonImmutable::now($s->timezone)->startOfDay();
        if ($article->slot_date) {
            $local = CarbonImmutable::parse($article->slot_date->format('Y-m-d'), $s->timezone);
        }

        // 1. Sujet
        if ($forcedCategory === null && $article->editorial_category_id && $article->topic && $article->generation_attempts > 0) {
            $cat = $article->category;
            $topic = $article->topic; // nouvelle tentative : même sujet
        } else {
            [$cat, $topic] = $this->topics->pick($user, $local, $forcedCategory);
        }

        // 2. Sources d'actualité si la catégorie l'exige
        $items = [];
        if ($cat->requires_sources) {
            $items = $this->sources->collect();
            if (! $items) {
                $this->log->warning($user, 'sources_unavailable', "Aucune source d'actualité disponible : sujet intemporel choisi à la place.", $article);
                [$cat, $topic] = $this->topics->fallbackForNews($user, $local);
            }
        }

        $provider = $this->llm->provider($s->llm_provider);
        $length = $this->prompts->resolveLength($s->article_length);
        $angle = EditorialCatalog::angles()[array_rand(EditorialCatalog::angles())];
        $openings = Article::where('user_id', $user->id)->where('id', '!=', $article->id)
            ->where('created_at', '>=', now()->subDays(30))->latest()->limit(10)->pluck('content')
            ->map(fn ($c) => Similarity::opening($c, 10))->filter()->values()->all();

        $system = $this->prompts->system($s);
        $issues = [];
        $best = null;
        for ($round = 0; $round < 3; $round++) {
            $raw = $provider->complete($system, $this->prompts->user($s, $cat, $topic, $angle, $length, $items, $openings, $issues));
            $parsed = $this->parser->parse($raw);
            if (! $parsed) {
                $issues = ['La réponse doit être un unique objet JSON valide avec les champs title, content, hashtags, sources.'];
                continue;
            }
            if (! $items) {
                $parsed['sources'] = [];
            }
            $q = $this->quality->check($parsed, $s, $length, $items, $user->id, $article->id);
            if (! $best || count($q['blocking']) < count($best[1]['blocking'])) {
                $best = [$parsed, $q];
            }
            if (! $q['blocking']) {
                break;
            }
            $issues = $q['blocking'];
        }
        if (! $best) {
            throw new LlmException('Le modèle n\'a pas produit de réponse exploitable après 3 essais.');
        }

        [$parsed, $q] = $best;
        $ok = empty($q['blocking']);
        $status = ($ok && $s->isAutomatic()) ? Article::APPROVED : Article::NEEDS_REVIEW;

        $article->fill([
            'editorial_category_id' => $cat->id,
            'topic' => $topic,
            'angle' => $angle,
            'title' => $parsed['title'],
            'content' => $parsed['content'],
            'hashtags' => array_slice($parsed['hashtags'], 0, 10),
            'sources' => $this->sourcesWithDates($parsed['sources'], $items),
            'language' => $s->language,
            'status' => $status,
            'quality_score' => $q['score'],
            'quality_issues' => array_merge($q['blocking'], $q['warnings']),
            'word_count' => $q['word_count'],
            'content_hash' => Article::hashContent($parsed['content']),
            'generated_at' => now(),
            'error' => null,
            'next_generation_at' => null,
            'provider' => $provider->key(),
            'model' => $provider->model(),
        ]);
        try {
            $article->save();
        } catch (QueryException $e) {
            // Contrainte d'unicité sur le contenu : jamais deux fois le même texte.
            $article->content_hash = null;
            $article->status = Article::NEEDS_REVIEW;
            $article->quality_issues = array_merge($article->quality_issues ?? [], ['Contenu identique à un article existant.']);
            $article->save();
        }
        $cat->forceFill(['last_used_at' => now()])->save();
        return $article;
    }

    private function sourcesWithDates(array $cited, array $items): array
    {
        $byUrl = collect($items)->keyBy('url');
        return array_map(fn ($s) => [
            'title' => $s['title'],
            'url' => $s['url'],
            'date' => $byUrl[$s['url']]['date'] ?? null,
        ], $cited);
    }
}
