<?php

namespace App\Services\Content;

use App\Models\Article;
use App\Models\EditorialCategory;
use App\Models\PublicationSchedule;
use App\Models\User;
use App\Support\EditorialCatalog;
use Carbon\CarbonImmutable;

/**
 * Choix du sujet du jour : catégories prévues par le calendrier pour ce jour,
 * pondérées pour favoriser celles utilisées le moins récemment, puis un angle
 * non traité depuis 30 jours.
 */
class TopicSelector
{
    public function categoriesFor(User $user, int $weekday): array
    {
        $slugs = PublicationSchedule::where('user_id', $user->id)->where('weekday', $weekday)->value('category_slugs') ?? [];
        $q = EditorialCategory::where('user_id', $user->id)->where('enabled', true);
        if (! empty($slugs)) {
            $q->whereIn('slug', $slugs);
        }
        $cats = $q->get();
        // Aucune catégorie active ce jour-là : toutes les catégories actives.
        return $cats->isNotEmpty() ? $cats->all()
            : EditorialCategory::where('user_id', $user->id)->where('enabled', true)->get()->all();
    }

    /** @return array{0: EditorialCategory, 1: string} */
    public function pick(User $user, CarbonImmutable $localDate, ?string $forcedSlug = null, array $excludeSlugs = []): array
    {
        if ($forcedSlug) {
            $cat = EditorialCategory::where('user_id', $user->id)->where('slug', $forcedSlug)->firstOrFail();
        } else {
            $cats = array_values(array_filter($this->categoriesFor($user, $localDate->dayOfWeekIso),
                fn ($c) => ! in_array($c->slug, $excludeSlugs, true)));
            if (empty($cats)) {
                $cats = EditorialCategory::where('user_id', $user->id)->where('enabled', true)
                    ->whereNotIn('slug', $excludeSlugs)->get()->all();
            }
            if (empty($cats)) {
                throw new \RuntimeException('Aucune catégorie éditoriale active.');
            }
            $cat = $this->weighted($cats);
        }
        return [$cat, $this->topicFor($user, $cat)];
    }

    public function fallbackForNews(User $user, CarbonImmutable $localDate): array
    {
        $slugs = EditorialCatalog::newsFallback();
        $cats = EditorialCategory::where('user_id', $user->id)->where('enabled', true)->whereIn('slug', $slugs)->get()->all();
        if (empty($cats)) {
            return $this->pick($user, $localDate, null, ['news-vulns', 'news-threats']);
        }
        $cat = $this->weighted($cats);
        return [$cat, $this->topicFor($user, $cat)];
    }

    private function weighted(array $cats): EditorialCategory
    {
        // Poids : plus une catégorie est ancienne, plus elle a de chances d'être choisie.
        $now = time();
        $weights = array_map(function ($c) use ($now) {
            $days = $c->last_used_at ? max(1, intdiv($now - $c->last_used_at->getTimestamp(), 86400)) : 60;
            return min(60, $days) * max(1, (int) $c->weight);
        }, $cats);
        $r = random_int(1, max(1, array_sum($weights)));
        foreach ($cats as $i => $c) {
            $r -= $weights[$i];
            if ($r <= 0) {
                return $c;
            }
        }
        return end($cats);
    }

    private function topicFor(User $user, EditorialCategory $cat): string
    {
        $recent = Article::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDays((int) config('cyberpost.generation.similarity_window_days', 30)))
            ->pluck('topic')->filter()->all();
        $topics = $cat->topics ?: [$cat->name];
        $fresh = array_values(array_diff($topics, $recent));
        $pool = $fresh ?: $topics;
        return $pool[array_rand($pool)];
    }
}
