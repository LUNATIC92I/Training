<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LinkedInAccount;
use App\Models\User;
use App\Services\LinkedIn\LinkedInClient;
use App\Services\LinkedIn\LinkedInException;
use App\Services\Notify\ActivityLog;
use App\Services\Notify\Notifier;
use Illuminate\Http\Request;

class LinkedInController extends Controller
{
    /** État de connexion présenté à l'application (sans aucun jeton). */
    public static function statusFor(User $user, LinkedInClient $client): array
    {
        if (! $client->isConfigured()) {
            return ['status' => 'not_configured', 'connected' => false, 'configured' => false,
                'message' => "Application LinkedIn non configurée sur le serveur. Voir docs/LINKEDIN.md."];
        }
        $a = LinkedInAccount::where('user_id', $user->id)->first();
        if (! $a || $a->status === 'revoked') {
            return ['status' => 'not_connected', 'connected' => false, 'configured' => true, 'message' => 'Aucun compte LinkedIn connecté.'];
        }
        $base = ['connected' => true, 'configured' => true, 'name' => $a->name, 'expires_at' => $a->expires_at?->toIso8601String()];
        if (! $a->isUsable()) {
            return $base + ['status' => 'expired', 'connected' => false, 'message' => 'Autorisation LinkedIn expirée : reconnectez votre compte.'];
        }
        if (! $a->hasScope('w_member_social')) {
            return $base + ['status' => 'expired', 'message' => "Permission w_member_social absente : ajoutez le produit « Share on LinkedIn » puis reconnectez-vous."];
        }
        if ($a->expires_at && $a->expires_at->lt(now()->addDays(7))) {
            return $base + ['status' => 'expiring', 'message' => 'Autorisation expirant le '.$a->expires_at->format('d/m/Y').' : reconnectez-vous bientôt.'];
        }
        return $base + ['status' => 'connected', 'message' => 'Connecté et autorisé à publier.'];
    }

    public function status(Request $r, LinkedInClient $client)
    {
        return response()->json(['data' => self::statusFor($r->user(), $client)]);
    }

    public function connect(Request $r, LinkedInClient $client)
    {
        abort_unless($client->isConfigured(), 503, "L'application LinkedIn n'est pas configurée sur le serveur (voir docs/LINKEDIN.md).");
        return response()->json(['data' => ['authorization_url' => $client->authorizationUrl($r->user())]]);
    }

    public function disconnect(Request $r, ActivityLog $log)
    {
        LinkedInAccount::where('user_id', $r->user()->id)->delete();
        $log->info($r->user(), 'linkedin_disconnected', 'Compte LinkedIn déconnecté (jetons supprimés du serveur).');
        return response()->json(['ok' => true, 'message' => "Compte LinkedIn déconnecté. Vous pouvez aussi révoquer l'accès depuis les paramètres de confidentialité de LinkedIn."]);
    }

    /** Route web publique appelée par LinkedIn après l'autorisation. */
    public function callback(Request $r, LinkedInClient $client, ActivityLog $log, Notifier $notifier)
    {
        $deep = config('cyberpost.app_deep_link');
        $back = fn (string $status, string $message = '') => $this->bridge($deep.'?'.http_build_query(array_filter(['status' => $status, 'message' => $message])), $status === 'success', $message);

        $state = (string) $r->query('state', '');
        $user = $state !== '' ? $client->consumeState($state) : null;
        if (! $user) {
            return $back('error', 'Requête expirée ou invalide. Relancez la connexion depuis l\'application.');
        }
        if ($r->filled('error')) {
            $msg = $r->query('error') === 'user_cancelled_authorize' ? 'Autorisation annulée.' : 'LinkedIn a refusé l\'autorisation : '.mb_substr((string) $r->query('error_description', $r->query('error')), 0, 200);
            $log->warning($user, 'linkedin_denied', $msg);
            return $back('error', $msg);
        }
        try {
            $account = $client->connect($user, (string) $r->query('code'));
        } catch (LinkedInException $e) {
            $log->error($user, 'linkedin_connect_failed', $e->getMessage());
            return $back('error', $e->getMessage());
        }
        $log->success($user, 'linkedin_connected', "Compte LinkedIn connecté : {$account->name}.");
        $notifier->send($user, 'linkedin_connected', 'LinkedIn connecté', "Le compte {$account->name} est connecté et autorisé à publier.", 'success');
        return $back('success');
    }

    /** Page minimale qui renvoie vers l'application (et reste lisible si l'app n'est pas installée). */
    private function bridge(string $url, bool $ok, string $message)
    {
        $u = e($url);
        $title = $ok ? 'Compte LinkedIn connecté' : 'Connexion LinkedIn non aboutie';
        $text = $ok ? 'Vous pouvez revenir dans CyberPost AI.' : e($message);
        $html = "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
            ."<meta http-equiv=\"refresh\" content=\"0;url=$u\"><title>CyberPost AI</title>"
            ."<style>body{background:#05080F;color:#F2F6FB;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}a{color:#00D1C1}</style></head>"
            ."<body><main><h1>$title</h1><p>$text</p><p><a href=\"$u\">Retourner dans l'application</a></p></main></body></html>";
        return response($html, 200, ['Content-Type' => 'text/html; charset=utf-8', 'Cache-Control' => 'no-store']);
    }
}
