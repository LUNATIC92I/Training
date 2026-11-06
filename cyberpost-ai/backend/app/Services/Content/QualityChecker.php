<?php

namespace App\Services\Content;

use App\Models\ApplicationSetting;
use App\Models\Article;
use Carbon\CarbonImmutable;

/**
 * Contrôle qualité automatique avant toute publication.
 *
 * Problèmes « bloquants » : la publication automatique est impossible tant
 * qu'ils ne sont pas corrigés (régénération ou validation humaine).
 * Avertissements : signalés, sans bloquer.
 */
class QualityChecker
{
    public const MAX_CHARS = 2900; // limite LinkedIn de 3000 caractères, marge pour les hashtags

    private const CLICHES_FR = ["à l'ère du numérique", 'dans un monde où', 'dans un monde de plus en plus', 'plongeons', 'game changer',
        'en conclusion,', "n'hésitez pas à", 'saviez-vous que', 'il est crucial de noter', 'véritable révolution',
        'dans le paysage actuel', 'dans le paysage numérique', 'force est de constater', 'en ces temps', 'sans plus attendre',
        'aujourd\'hui plus que jamais', 'boostez', 'incontournable'];
    private const CLICHES_EN = ["in today's digital world", 'in today\'s fast-paced', 'game changer', 'game-changer', "let's dive in",
        'in conclusion,', 'delve', 'ever-evolving landscape', 'it is crucial to note', 'unlock the power', 'revolutionize'];
    // Formulations d'anecdotes personnelles qui seraient inventées par le modèle.
    private const ANECDOTES = ['la semaine dernière', 'le mois dernier', 'hier, ', 'un client m\'a', 'un de mes clients', 'lors de ma dernière mission',
        'dans mon ancien poste', 'quand je travaillais chez', 'last week', 'yesterday, ', 'one of my clients', 'at my previous job'];

    /**
     * @param array $parsed  Résultat d'ArticleParser.
     * @param array $sourceItems Sources fournies au modèle (vide pour un sujet intemporel).
     * @return array{blocking: string[], warnings: string[], score: int, word_count: int}
     */
    public function check(array $parsed, ApplicationSetting $s, string $length, array $sourceItems, int $userId, ?int $ignoreArticleId = null): array
    {
        $blocking = [];
        $warnings = [];
        $content = $parsed['content'];
        $lower = mb_strtolower($content);
        $words = count(preg_split('/\s+/u', trim($content)));
        [$min, $max] = PromptBuilder::LENGTHS[$length] ?? [130, 420];

        // Longueur
        $tagsLen = array_sum(array_map(fn ($t) => mb_strlen($t) + 2, $parsed['hashtags']));
        if (mb_strlen($content) + $tagsLen + 2 > self::MAX_CHARS) {
            $blocking[] = 'Texte trop long pour LinkedIn (limite de 3000 caractères).';
        }
        if ($words < $min * 0.7) {
            $blocking[] = "Texte trop court ($words mots, minimum attendu : $min).";
        } elseif ($words > $max * 1.3) {
            $warnings[] = "Texte plus long que prévu ($words mots).";
        }

        // Question finale
        $tail = mb_substr($content, -350);
        if (! str_contains($tail, '?')) {
            $blocking[] = 'Pas de question finale pour inviter aux commentaires.';
        }

        // Hashtags
        $n = count($parsed['hashtags']);
        if ($s->hashtags_count > 0 && abs($n - $s->hashtags_count) > 1) {
            $blocking[] = "Nombre de hashtags incorrect ($n au lieu de {$s->hashtags_count}).";
        }
        if (preg_match('/(^|\s)#[\p{L}\p{N}_]{2,}/u', $content)) {
            $warnings[] = 'Des hashtags figurent dans le corps du texte.';
        }

        // Clichés et style artificiel
        foreach ($s->language === 'en' ? self::CLICHES_EN : self::CLICHES_FR as $c) {
            if (str_contains($lower, $c)) {
                $blocking[] = "Formule artificielle à éviter : « $c ».";
            }
        }
        preg_match_all('/\p{Extended_Pictographic}/u', $content, $emo);
        if (count($emo[0]) > 2) {
            $blocking[] = 'Trop d\'émojis ('.count($emo[0]).').';
        }
        if (substr_count($content, '—') > 2) {
            $warnings[] = 'Usage excessif du tiret cadratin.';
        }
        if (preg_match('/\*\*|^#{1,6}\s/m', $content)) {
            $blocking[] = 'Mise en forme Markdown non supportée par LinkedIn.';
        }

        // Anecdotes inventées
        foreach (self::ANECDOTES as $a) {
            if (str_contains($lower, $a)) {
                $blocking[] = "Anecdote personnelle non vérifiable (« $a ») : l'auteur ne l'a pas fournie.";
            }
        }

        // Faits : CVE, chiffres, dates, URL de sources
        $allowedCves = collect($sourceItems)->pluck('cves')->flatten()->map(fn ($c) => strtoupper($c))->unique()->all();
        preg_match_all('/CVE-\d{4}-\d{4,7}/i', $content, $m);
        foreach (array_unique(array_map('strtoupper', $m[0])) as $cve) {
            if (! in_array($cve, $allowedCves, true)) {
                $blocking[] = "Identifiant $cve absent des sources officielles fournies : risque d'invention.";
            }
        }
        if (! $sourceItems) {
            if (preg_match('/\d+(?:[.,]\d+)?\s?%|\b\d+(?:[.,]\d+)?\s?(?:millions?|milliards?|billions?|k€|m€|md€)\b/iu', $content)) {
                $blocking[] = 'Chiffre ou statistique sans source : retirez-le ou ajoutez une source vérifiable.';
            }
            $year = (int) CarbonImmutable::now()->format('Y');
            if (preg_match_all('/\b(19[89]\d|20[0-4]\d)\b/', $content, $ym)) {
                foreach (array_unique($ym[1]) as $y) {
                    if ((int) $y !== $year) {
                        $blocking[] = "Année $y citée sans source : à vérifier.";
                    }
                }
            }
            if ($parsed['sources']) {
                $warnings[] = 'Sources ajoutées par le modèle ignorées (aucune source fournie).';
            }
        } else {
            $allowedUrls = collect($sourceItems)->pluck('url')->all();
            foreach ($parsed['sources'] as $src) {
                if (! in_array($src['url'], $allowedUrls, true)) {
                    $blocking[] = 'Source non fournie citée : '.$src['url'];
                }
            }
            if (! $parsed['sources']) {
                $blocking[] = 'Sujet d\'actualité sans référence de source.';
            }
        }

        // Répétitions : accroche et contenu proches des 30 derniers jours
        $since = now()->subDays((int) config('cyberpost.generation.similarity_window_days', 30));
        $recent = Article::where('user_id', $userId)->where('created_at', '>=', $since)
            ->whereNotIn('status', [Article::GENERATION_FAILED])
            ->when($ignoreArticleId, fn ($q) => $q->where('id', '!=', $ignoreArticleId))
            ->latest()->limit(40)->get(['id', 'content']);
        $opening = Similarity::opening($content);
        $threshold = (float) config('cyberpost.generation.similarity_threshold', 0.30);
        foreach ($recent as $r) {
            if ($opening !== '' && Similarity::opening($r->content) === $opening) {
                $blocking[] = 'Accroche identique à une publication récente.';
                break;
            }
        }
        foreach ($recent as $r) {
            $sim = Similarity::jaccard($content, $r->content);
            if ($sim >= $threshold) {
                $blocking[] = sprintf('Contenu trop proche d\'un article des 30 derniers jours (similarité %d %%).', round($sim * 100));
                break;
            }
        }
        if (Article::where('user_id', $userId)->where('content_hash', Article::hashContent($content))
            ->when($ignoreArticleId, fn ($q) => $q->where('id', '!=', $ignoreArticleId))->exists()) {
            $blocking[] = 'Contenu strictement identique à un article existant.';
        }

        $blocking = array_values(array_unique($blocking));
        $score = max(0, 100 - 15 * count($blocking) - 5 * count($warnings));
        return ['blocking' => $blocking, 'warnings' => $warnings, 'score' => $score, 'word_count' => $words];
    }
}
