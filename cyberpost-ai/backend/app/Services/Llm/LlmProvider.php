<?php

namespace App\Services\Llm;

/** Contrat commun aux fournisseurs de modèles de langage. */
interface LlmProvider
{
    public function key(): string;

    public function isConfigured(): bool;

    public function model(): ?string;

    /**
     * @return string Texte brut produit par le modèle.
     * @throws LlmException
     */
    public function complete(string $system, string $user, int $maxTokens = 2500, float $temperature = 0.8): string;
}
