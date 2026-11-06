<?php

namespace App\Services\Llm;

use InvalidArgumentException;

/** Sélection du fournisseur de génération configuré. */
class LlmManager
{
    public function provider(?string $key = null): LlmProvider
    {
        $key = $key ?: config('cyberpost.llm.default_provider');
        $cfg = config("cyberpost.llm.providers.$key");
        if (! $cfg) {
            throw new InvalidArgumentException("Fournisseur inconnu : $key");
        }
        $timeout = (int) config('cyberpost.llm.timeout', 120);
        return match ($cfg['driver']) {
            'anthropic' => new AnthropicProvider($key, $cfg, $timeout),
            'openai_compatible' => new OpenAiCompatibleProvider($key, $cfg, $timeout),
            default => throw new InvalidArgumentException("Pilote inconnu : {$cfg['driver']}"),
        };
    }

    /** Liste publique (sans secrets) des fournisseurs et de leur état. */
    public function catalog(): array
    {
        return collect(config('cyberpost.llm.providers'))->map(function ($cfg, $key) {
            $p = $this->provider($key);
            return ['key' => $key, 'name' => $cfg['name'], 'configured' => $p->isConfigured(), 'model' => $p->model()];
        })->values()->all();
    }

    public function keys(): array { return array_keys(config('cyberpost.llm.providers')); }
}
