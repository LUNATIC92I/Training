<?php

namespace App\Services\Notify;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Envoi via l'API HTTP v1 de Firebase Cloud Messaging, authentifié par un
 * compte de service Google (fichier JSON hors du dépôt, FCM_SERVICE_ACCOUNT_PATH).
 */
class FcmClient
{
    public function isConfigured(): bool
    {
        $p = config('cyberpost.fcm.service_account_path');
        return $p && is_readable($p) && config('cyberpost.fcm.project_id');
    }

    public function clientConfigured(): bool
    {
        return $this->isConfigured() && config('cyberpost.fcm.application_id') && config('cyberpost.fcm.api_key') && config('cyberpost.fcm.sender_id');
    }

    /** @return bool|string true si envoyé, 'unregistered' si le jeton n'est plus valide */
    public function send(string $deviceToken, array $data): bool|string
    {
        $res = Http::withToken($this->accessToken())->acceptJson()->timeout(15)
            ->post('https://fcm.googleapis.com/v1/projects/'.config('cyberpost.fcm.project_id').'/messages:send', [
                'message' => [
                    'token' => $deviceToken,
                    'data' => array_map('strval', $data),
                    'android' => ['priority' => 'HIGH'],
                ],
            ]);
        if ($res->successful()) {
            return true;
        }
        if (in_array($res->json('error.status'), ['NOT_FOUND', 'UNREGISTERED'], true) || $res->status() === 404) {
            return 'unregistered';
        }
        throw new RuntimeException('FCM HTTP '.$res->status().' '.($res->json('error.message') ?? ''));
    }

    private function accessToken(): string
    {
        return Cache::remember('cyberpost:fcm:token', 3000, function () {
            $sa = json_decode(file_get_contents(config('cyberpost.fcm.service_account_path')), true);
            if (! isset($sa['client_email'], $sa['private_key'])) {
                throw new RuntimeException('Compte de service FCM invalide.');
            }
            $now = time();
            $b64 = fn ($d) => rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
            $header = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
            $claims = $b64(json_encode([
                'iss' => $sa['client_email'],
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud' => 'https://oauth2.googleapis.com/token',
                'iat' => $now, 'exp' => $now + 3600,
            ]));
            openssl_sign("$header.$claims", $sig, $sa['private_key'], OPENSSL_ALGO_SHA256);
            $res = Http::asForm()->timeout(15)->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => "$header.$claims.".$b64($sig),
            ]);
            if ($res->failed()) {
                throw new RuntimeException('Authentification Google pour FCM refusée (HTTP '.$res->status().').');
            }
            return $res->json('access_token');
        });
    }
}
