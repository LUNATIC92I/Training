<?php

namespace App\Services\LinkedIn;

/**
 * Résultat d'une tentative de création de post.
 *
 * kind :
 *  - created    : LinkedIn a confirmé (HTTP 201) ; urn = identifiant du post
 *  - retryable  : aucune création possible (connexion impossible, 429) -> nouvelle tentative autorisée
 *  - uncertain  : la requête a pu être reçue (délai dépassé, 5xx, coupure) -> JAMAIS de renvoi automatique
 *  - auth       : jeton invalide ou expiré (401)
 *  - forbidden  : permission manquante (403), ex. w_member_social non accordée
 *  - version    : version d'API retirée (426)
 *  - rejected   : contenu refusé (400, 422…) -> échec définitif
 */
final class PostResult
{
    public function __construct(
        public readonly string $kind,
        public readonly ?string $urn = null,
        public readonly ?int $status = null,
        public readonly string $message = '',
    ) {}

    public function created(): bool { return $this->kind === 'created'; }
}
