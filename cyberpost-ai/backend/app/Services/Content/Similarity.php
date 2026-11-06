<?php

namespace App\Services\Content;

/** Similarité de Jaccard sur trigrammes de mots normalisés. */
class Similarity
{
    public static function shingles(string $text): array
    {
        $t = mb_strtolower(strip_tags($text));
        $t = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $t);
        $words = array_values(array_filter(preg_split('/\s+/u', $t), fn ($w) => mb_strlen($w) > 2));
        $set = [];
        for ($i = 0; $i + 2 < count($words); $i++) {
            $set[$words[$i].' '.$words[$i + 1].' '.$words[$i + 2]] = true;
        }
        return $set;
    }

    public static function jaccard(string $a, string $b): float
    {
        $sa = self::shingles($a);
        $sb = self::shingles($b);
        if (! $sa || ! $sb) {
            return 0.0;
        }
        $inter = count(array_intersect_key($sa, $sb));
        $union = count($sa + $sb);
        return $union ? $inter / $union : 0.0;
    }

    /** Premiers mots d'un texte, pour détecter les accroches répétées. */
    public static function opening(string $text, int $words = 6): string
    {
        $first = trim(strtok($text, "\n") ?: $text);
        $parts = preg_split('/\s+/u', mb_strtolower($first));
        return implode(' ', array_slice($parts, 0, $words));
    }
}
