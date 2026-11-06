<?php

namespace App\Services\LinkedIn;

use App\Models\LinkedInAccount;
use App\Models\OAuthState;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Intégration officielle LinkedIn : OAuth 2.0 (flux « authorization code »),
 * OpenID Connect (userinfo) et API Posts (/rest/posts).
 * Aucun scraping, aucune automatisation de navigateur, aucun mot de passe.
 */
class LinkedInClient
{
    public function isConfigured(): bool
    {
        $c = config('cyberpost.linkedin');
        return ! empty($c['client_id']) && ! empty($c['client_secret']) && ! empty($c['redirect_uri']);
    }

    // ------------------------------------------------------------------ OAuth

    /** Crée un état anti-CSRF à usage unique (10 minutes) et renvoie l'URL d'autorisation. */
    public function authorizationUrl(User $user): string
    {
        $state = Str::random(48);
        OAuthState::create(['user_id' => $user->id, 'state_hash' => hash('sha256', $state), 'expires_at' => now()->addMinutes(10)]);
        $c = config('cyberpost.linkedin');
        return $c['authorize_url'].'?'.http_build_query([
            'response_type' => 'code',
            'client_id' => $c['client_id'],
            'redirect_uri' => $c['redirect_uri'],
            'state' => $state,
            'scope' => $c['scopes'],
        ], '', '&', PHP_QUERY_RFC3986);
    }

    /** Valide et consomme l'état ; renvoie l'utilisateur concerné. */
    public function consumeState(string $state): ?User
    {
        $row = OAuthState::where('state_hash', hash('sha256', $state))->whereNull('used_at')->where('expires_at', '>', now())->first();
        if (! $row) {
            return null;
        }
        $updated = OAuthState::where('id', $row->id)->whereNull('used_at')->update(['used_at' => now()]);
        return $updated ? User::find($row->user_id) : null;
    }

    /** Échange le code d'autorisation, identifie le membre et enregistre le compte. */
    public function connect(User $user, string $code): LinkedInAccount
    {
        $c = config('cyberpost.linkedin');
        $tok = $this->tokenRequest([
            'grant_type' => 'authorization_code', 'code' => $code,
            'client_id' => $c['client_id'], 'client_secret' => $c['client_secret'], 'redirect_uri' => $c['redirect_uri'],
        ]);
        $info = $this->userinfo($tok['access_token']);
        if (empty($info['sub'])) {
            throw new LinkedInException("LinkedIn n'a pas renvoyé l'identifiant du membre (produit « Sign In with LinkedIn using OpenID Connect » requis).");
        }
        $scopes = $tok['scope'] ?? $c['scopes'];
        $account = LinkedInAccount::updateOrCreate(['user_id' => $user->id], [
            'member_id' => $info['sub'],
            'person_urn' => 'urn:li:person:'.$info['sub'],
            'name' => $info['name'] ?? trim(($info['given_name'] ?? '').' '.($info['family_name'] ?? '')),
            'email' => $info['email'] ?? null,
            'access_token' => $tok['access_token'],
            'refresh_token' => $tok['refresh_token'] ?? null,
            'expires_at' => isset($tok['expires_in']) ? now()->addSeconds((int) $tok['expires_in']) : null,
            'refresh_expires_at' => isset($tok['refresh_token_expires_in']) ? now()->addSeconds((int) $tok['refresh_token_expires_in']) : null,
            'scopes' => $scopes,
            'status' => 'connected',
            'connected_at' => now(),
            'last_verified_at' => now(),
            'expiry_warned_at' => null,
            'last_error' => null,
        ]);
        if (! $account->hasScope('w_member_social')) {
            $account->update(['last_error' => "La permission w_member_social n'a pas été accordée : la publication sera refusée."]);
        }
        return $account;
    }

    /** Renouvelle le jeton si LinkedIn a fourni un jeton de rafraîchissement (réservé à certains partenaires). */
    public function refresh(LinkedInAccount $account): bool
    {
        if (! $account->refresh_token || ($account->refresh_expires_at && $account->refresh_expires_at->isPast())) {
            return false;
        }
        $c = config('cyberpost.linkedin');
        $tok = $this->tokenRequest([
            'grant_type' => 'refresh_token', 'refresh_token' => $account->refresh_token,
            'client_id' => $c['client_id'], 'client_secret' => $c['client_secret'],
        ]);
        $account->update([
            'access_token' => $tok['access_token'],
            'refresh_token' => $tok['refresh_token'] ?? $account->refresh_token,
            'expires_at' => isset($tok['expires_in']) ? now()->addSeconds((int) $tok['expires_in']) : $account->expires_at,
            'refresh_expires_at' => isset($tok['refresh_token_expires_in']) ? now()->addSeconds((int) $tok['refresh_token_expires_in']) : $account->refresh_expires_at,
            'status' => 'connected', 'expiry_warned_at' => null, 'last_error' => null,
        ]);
        return true;
    }

    private function tokenRequest(array $form): array
    {
        try {
            $res = Http::asForm()->acceptJson()->timeout(config('cyberpost.linkedin.timeout'))->post(config('cyberpost.linkedin.token_url'), $form);
        } catch (ConnectionException $e) {
            throw new LinkedInException('LinkedIn injoignable lors de l\'échange du jeton.');
        }
        if ($res->failed() || ! $res->json('access_token')) {
            $err = $res->json('error_description') ?? $res->json('error') ?? ('HTTP '.$res->status());
            throw new LinkedInException("LinkedIn a refusé l'échange du jeton : $err", $res->status());
        }
        return $res->json();
    }

    /** @return array Informations OpenID Connect du membre (sub, name, email…). */
    public function userinfo(string $accessToken): array
    {
        try {
            $res = Http::withToken($accessToken)->acceptJson()->timeout(config('cyberpost.linkedin.timeout'))->get(config('cyberpost.linkedin.userinfo_url'));
        } catch (ConnectionException $e) {
            throw new LinkedInException('LinkedIn injoignable.');
        }
        if ($res->status() === 401) {
            throw new LinkedInException('Jeton LinkedIn invalide ou expiré.', 401);
        }
        if ($res->status() === 403) {
            throw new LinkedInException("Accès refusé par LinkedIn : vérifiez que les produits « Sign In with LinkedIn using OpenID Connect » et « Share on LinkedIn » sont ajoutés à votre application.", 403);
        }
        if ($res->failed()) {
            throw new LinkedInException('Erreur LinkedIn (HTTP '.$res->status().').', $res->status());
        }
        return $res->json();
    }

    // ------------------------------------------------------------------ Posts API

    public function createPost(LinkedInAccount $account, string $content, array $hashtags): PostResult
    {
        $c = config('cyberpost.linkedin');
        $payload = [
            'author' => $account->person_urn,
            'commentary' => LittleText::commentary($content, $hashtags),
            'visibility' => 'PUBLIC',
            'distribution' => ['feedDistribution' => 'MAIN_FEED', 'targetEntities' => [], 'thirdPartyDistributionChannels' => []],
            'lifecycleState' => 'PUBLISHED',
            'isReshareDisabledByAuthor' => false,
        ];
        try {
            $res = Http::withToken($account->access_token)
                ->withHeaders(['Linkedin-Version' => $c['api_version'], 'X-Restli-Protocol-Version' => '2.0.0'])
                ->acceptJson()->asJson()
                ->connectTimeout(10)->timeout($c['timeout'])
                ->post($c['posts_url'], $payload);
        } catch (ConnectionException $e) {
            // cURL 6 (DNS), 7 (connexion impossible) : la requête n'a jamais atteint LinkedIn.
            $msg = $e->getMessage();
            if (preg_match('/cURL error (6|7)\b|Could not resolve host|Connection refused|Failed to connect/i', $msg)) {
                return new PostResult('retryable', null, null, 'Connexion à LinkedIn impossible (requête non envoyée).');
            }
            // Délai dépassé, coupure en cours d'échange : le post a peut-être été créé.
            return new PostResult('uncertain', null, null, 'Réponse de LinkedIn non reçue (délai dépassé ou coupure) : le post a peut-être été créé.');
        } catch (RequestException $e) {
            return new PostResult('uncertain', null, null, 'Erreur réseau ambiguë lors de la publication.');
        }

        $status = $res->status();
        $serviceMsg = $res->json('message') ?? '';
        return match (true) {
            $status === 201 => new PostResult('created', $res->header('x-restli-id') ?: $res->header('X-RestLi-Id') ?: null, 201, 'Publication créée par LinkedIn.'),
            $status === 401 => new PostResult('auth', null, 401, 'Jeton LinkedIn invalide ou expiré : reconnectez votre compte.'),
            $status === 403 => new PostResult('forbidden', null, 403, "LinkedIn refuse la publication : l'application n'a pas la permission w_member_social (produit « Share on LinkedIn »). $serviceMsg"),
            $status === 426 => new PostResult('version', null, 426, "Version d'API LinkedIn retirée ({$c['api_version']}) : mettez à jour LINKEDIN_API_VERSION. $serviceMsg"),
            $status === 429 => new PostResult('retryable', null, 429, 'Limite de requêtes LinkedIn atteinte : nouvelle tentative programmée.'),
            $status >= 500 => new PostResult('uncertain', null, $status, "Erreur serveur LinkedIn (HTTP $status) : impossible de savoir si le post a été créé."),
            default => new PostResult('rejected', null, $status, "LinkedIn a refusé la publication (HTTP $status). $serviceMsg"),
        };
    }
}
