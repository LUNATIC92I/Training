<?php

namespace App\Services\Llm;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

/** Fournisseur exposant l'API chat/completions (OpenAI ou compatible). */
class OpenAiCompatibleProvider implements LlmProvider
{
    public function __construct(private string $key, private array $cfg, private int $timeout) {}

    public function key(): string { return $this->key; }
    public function isConfigured(): bool
    {
        return ! empty($this->cfg['api_key']) && ! empty($this->cfg['model']) && ! empty($this->cfg['base_url']);
    }
    public function model(): ?string { return $this->cfg['model'] ?? null; }

    public function complete(string $system, string $user, int $maxTokens = 2500, float $temperature = 0.8): string
    {
        if (! $this->isConfigured()) {
            throw new LlmException("Fournisseur « {$this->key} » non configuré (clé, modèle et URL requis).", false);
        }
        try {
            $res = Http::timeout($this->timeout)->withToken($this->cfg['api_key'])->acceptJson()
                ->post(rtrim($this->cfg['base_url'], '/').'/chat/completions', [
                    'model' => $this->cfg['model'],
                    'max_tokens' => $maxTokens,
                    'temperature' => $temperature,
                    'messages' => [
                        ['role' => 'system', 'content' => $system],
                        ['role' => 'user', 'content' => $user],
                    ],
                ]);
        } catch (ConnectionException $e) {
            throw new LlmException("Fournisseur « {$this->key} » injoignable : ".$e->getMessage());
        }
        if ($res->failed()) {
            $msg = $res->json('error.message') ?? ('HTTP '.$res->status());
            throw new LlmException("Le fournisseur « {$this->key} » a refusé la requête : {$msg}", in_array($res->status(), [408, 429, 500, 502, 503, 504], true));
        }
        $text = (string) $res->json('choices.0.message.content', '');
        if (trim($text) === '') {
            throw new LlmException('Réponse vide du fournisseur.');
        }
        return $text;
    }
}
