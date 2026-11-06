<?php

namespace App\Support;

/** Masque les secrets (jetons, clés d'API, mots de passe) avant journalisation. */
class Redactor
{
    private const PATTERNS = [
        '/(Bearer\s+)[A-Za-z0-9._\-~+\/=]{8,}/i' => '$1[MASQUÉ]',
        '/((?:access_token|refresh_token|client_secret|api_key|apikey|password|code|token)["\']?\s*[:=]\s*["\']?)[^"\'&\s,}]{6,}/i' => '$1[MASQUÉ]',
        '/\bsk-[A-Za-z0-9_\-]{10,}/' => '[MASQUÉ]',
        '/\bAQ[A-Za-z0-9_\-]{40,}/' => '[MASQUÉ]', // format habituel des jetons LinkedIn
    ];

    public static function redact(string $text): string
    {
        return preg_replace(array_keys(self::PATTERNS), array_values(self::PATTERNS), $text);
    }

    public static function redactArray(array $data): array
    {
        $out = [];
        foreach ($data as $k => $v) {
            if (is_string($k) && preg_match('/token|secret|password|api_key|authorization/i', $k)) {
                $out[$k] = '[MASQUÉ]';
            } elseif (is_array($v)) {
                $out[$k] = self::redactArray($v);
            } elseif (is_string($v)) {
                $out[$k] = self::redact($v);
            } else {
                $out[$k] = $v;
            }
        }
        return $out;
    }
}
