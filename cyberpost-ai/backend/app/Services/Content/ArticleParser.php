<?php

namespace App\Services\Content;

/** Extraction robuste de l'objet JSON renvoyé par le modèle. */
class ArticleParser
{
    /** @return array{title:string,content:string,hashtags:array,sources:array}|null */
    public function parse(string $raw): ?array
    {
        $raw = trim($raw);
        $raw = preg_replace('/^```(?:json)?\s*|\s*```$/m', '', $raw);
        $start = strpos($raw, '{');
        $end = strrpos($raw, '}');
        if ($start === false || $end === false || $end <= $start) {
            return null;
        }
        $data = json_decode(substr($raw, $start, $end - $start + 1), true);
        if (! is_array($data) || empty($data['content']) || ! is_string($data['content'])) {
            return null;
        }
        $content = trim(str_replace("\r\n", "\n", $data['content']));
        $content = preg_replace("/\n{3,}/", "\n\n", $content);
        // Retire les éventuels hashtags placés dans le texte malgré la consigne (fin du texte).
        $content = rtrim(preg_replace('/(\s*#[\p{L}\p{N}_]+)+\s*$/u', '', $content));

        $tags = [];
        foreach ((array) ($data['hashtags'] ?? []) as $t) {
            $t = preg_replace('/[^\p{L}\p{N}_]/u', '', ltrim((string) $t, '#'));
            if ($t !== '' && ! in_array(mb_strtolower($t), array_map('mb_strtolower', $tags), true)) {
                $tags[] = $t;
            }
        }
        $sources = [];
        foreach ((array) ($data['sources'] ?? []) as $s) {
            if (is_array($s) && ! empty($s['url']) && filter_var($s['url'], FILTER_VALIDATE_URL) && str_starts_with($s['url'], 'https://')) {
                $sources[] = ['title' => mb_substr(trim((string) ($s['title'] ?? $s['url'])), 0, 250), 'url' => $s['url']];
            }
        }
        $title = trim((string) ($data['title'] ?? ''));
        if ($title === '') {
            $title = mb_substr(strtok($content, "\n"), 0, 120);
        }
        return ['title' => mb_substr($title, 0, 250), 'content' => $content, 'hashtags' => $tags, 'sources' => $sources];
    }
}
