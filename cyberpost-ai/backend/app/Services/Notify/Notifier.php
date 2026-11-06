<?php

namespace App\Services\Notify;

use App\Models\AppNotification;
use App\Models\Article;
use App\Models\DeviceToken;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Notifications : enregistrées en base (consultables dans l'application,
 * synchronisées en secours toutes les 15 minutes) et poussées via FCM si
 * Firebase est configuré.
 */
class Notifier
{
    public function __construct(private FcmClient $fcm) {}

    public function send(User $user, string $type, string $title, string $body, string $level = 'info', ?Article $article = null, ?string $dedupeKey = null): ?AppNotification
    {
        try {
            $n = AppNotification::create([
                'user_id' => $user->id, 'type' => $type, 'title' => $title, 'body' => $body, 'level' => $level,
                'article_id' => $article?->id, 'dedupe_key' => $dedupeKey,
            ]);
        } catch (QueryException $e) {
            return null; // déjà notifié (dedupe_key)
        }
        $this->push($user, $n);
        return $n;
    }

    public function tokenExpired(User $user): void
    {
        $this->send($user, 'token_expired', 'Jeton LinkedIn expiré',
            'Votre connexion LinkedIn a expiré. Ouvrez CyberPost AI, Paramètres, puis « Reconnecter » pour reprendre les publications.',
            'error', null, 'token_expired:'.now()->format('Y-m-d'));
    }

    private function push(User $user, AppNotification $n): void
    {
        if (! $this->fcm->isConfigured()) {
            return;
        }
        $errors = [];
        foreach (DeviceToken::where('user_id', $user->id)->get() as $device) {
            try {
                $r = $this->fcm->send($device->token, [
                    'notification_id' => $n->id, 'type' => $n->type, 'title' => $n->title, 'body' => $n->body,
                    'level' => $n->level, 'article_id' => $n->article_id ?? '',
                ]);
                if ($r === 'unregistered') {
                    $device->delete();
                }
            } catch (Throwable $e) {
                $errors[] = $e->getMessage();
                Log::warning('Envoi FCM impossible', ['error' => $e->getMessage()]);
            }
        }
        $n->update(['pushed_at' => now(), 'push_error' => $errors ? mb_substr(implode(' | ', $errors), 0, 250) : null]);
    }
}
