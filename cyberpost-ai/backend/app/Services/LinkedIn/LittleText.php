<?php

namespace App\Services\LinkedIn;

/**
 * Mise au format « little text » exigé par le champ commentary de l'API Posts.
 * Tous les caractères réservés doivent être échappés par une barre oblique
 * inverse, même hors des éléments spéciaux (documentation LinkedIn).
 * Les hashtags sont ajoutés avec le modèle {hashtag|\#|Tag}.
 */
class LittleText
{
    private const RESERVED = ['\\', '|', '{', '}', '@', '[', ']', '(', ')', '<', '>', '#', '*', '_', '~'];

    public static function escape(string $text): string
    {
        $out = '';
        foreach (mb_str_split($text) as $ch) {
            $out .= in_array($ch, self::RESERVED, true) ? '\\'.$ch : $ch;
        }
        return $out;
    }

    public static function hashtag(string $tag): string
    {
        $clean = preg_replace('/[^\p{L}\p{N}_]/u', '', ltrim($tag, '#'));
        return '{hashtag|\\#|'.self::escape($clean).'}';
    }

    public static function commentary(string $content, array $hashtags): string
    {
        $body = self::escape(trim($content));
        $tags = array_filter(array_map(fn ($t) => preg_replace('/[^\p{L}\p{N}_]/u', '', ltrim((string) $t, '#')), $hashtags));
        if ($tags) {
            $body .= "\n\n".implode(' ', array_map([self::class, 'hashtag'], $tags));
        }
        return $body;
    }
}
