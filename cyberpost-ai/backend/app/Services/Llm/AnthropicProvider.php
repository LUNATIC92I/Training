<?php

namespace App\Services\Llm;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

/** Fournisseur Anthropic (API Messages). */
class AnthropicProvider implements LlmProvider
{
    public function __construct(private string $key, private array $cfg, private int $timeout) {}

    public function key(): string { return $this->key; }
    public function isConfigured(): bool { return ! empty($this->cfg['api_key']) && ! empty($this->cfg['model']); }
    public function model(): ?string { return $this->cfg['model'] ?? null; }

    public function complete(string $system, string $user, int $maxTokens = 2500, float $temperature = 0.8): string
    {
        if (! $this->isConfigured()) {
            throw new LlmException('Fournisseur Anthropic non configuré (ANTHROPIC_API_KEY, ANTHROPIC_MODEL).', false);
        }
        try {
            $res = Http::timeout($this->timeout)
                ->withHeaders(['x-api-key' => $this->cfg['api_key'], 'anthropic-version' => '2023-06-01'])
                ->acceptJson()
                ->post(rtrim($this->cfg['base_url'], '/').'/v1/messages', [
                    'model' => $this->cfg['model'],
                    'max_tokens' => $maxTokens,
                    'temperature' => $temperature,
                    'system' => $system,
                    'messages' => [['role' => 'user', 'content' => $user]],
                ]);
        } catch (ConnectionException $e) {
            throw new LlmException('Fournisseur Anthropic injoignable : '.$e->getMessage());
        }
        if ($res->failed()) {
            $msg = $res->json('error.message') ?? ('HTTP '.$res->status());
            throw new LlmException("Anthropic a refusé la requête : {$msg}", in_array($res->status(), [408, 429, 500, 502, 503, 504, 529], true));
        }
        $text = collect($res->json('content', []))->where('type', 'text')->pluck('text')->implode("\n");
        if (trim($text) === '') {
            throw new LlmException('Réponse vide du fournisseur Anthropic.');
        }
        return $text;
    }
}
