<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\DeviceToken;
use App\Models\PublicationLog;
use App\Services\Notify\FcmClient;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $r)
    {
        $items = AppNotification::where('user_id', $r->user()->id)->latest('id')->limit(100)->get()
            ->map(fn ($n) => ['id' => $n->id, 'type' => $n->type, 'title' => $n->title, 'body' => $n->body, 'level' => $n->level,
                'article_id' => $n->article_id, 'read_at' => $n->read_at?->toIso8601String(), 'created_at' => $n->created_at->toIso8601String()]);
        return response()->json(['data' => $items]);
    }

    public function read(Request $r, int $id)
    {
        AppNotification::where('user_id', $r->user()->id)->whereKey($id)->update(['read_at' => now()]);
        return response()->json(['ok' => true, 'message' => 'Notification lue.']);
    }

    public function readAll(Request $r)
    {
        AppNotification::where('user_id', $r->user()->id)->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['ok' => true, 'message' => 'Toutes les notifications sont lues.']);
    }

    public function registerDevice(Request $r)
    {
        $data = $r->validate(['fcm_token' => ['required', 'string', 'max:500'], 'platform' => ['nullable', 'in:android']]);
        DeviceToken::updateOrCreate(['token_hash' => hash('sha256', $data['fcm_token'])],
            ['user_id' => $r->user()->id, 'token' => $data['fcm_token'], 'platform' => 'android', 'last_seen_at' => now()]);
        return response()->json(['ok' => true, 'message' => 'Appareil enregistré pour les notifications.']);
    }

    public function unregisterDevice(Request $r)
    {
        $r->validate(['fcm_token' => ['required', 'string']]);
        DeviceToken::where('user_id', $r->user()->id)->where('token_hash', hash('sha256', $r->fcm_token))->delete();
        return response()->json(['ok' => true, 'message' => 'Appareil retiré.']);
    }

    /** Configuration publique de l'application Firebase (identifiants non secrets). */
    public function pushConfig(FcmClient $fcm)
    {
        if (! $fcm->clientConfigured()) {
            return response()->json(['data' => ['configured' => false]]);
        }
        return response()->json(['data' => [
            'configured' => true, 'project_id' => config('cyberpost.fcm.project_id'), 'application_id' => config('cyberpost.fcm.application_id'),
            'api_key' => config('cyberpost.fcm.api_key'), 'sender_id' => config('cyberpost.fcm.sender_id'),
        ]]);
    }

    public function logs(Request $r)
    {
        $r->validate(['level' => ['nullable', 'in:info,success,warning,error']]);
        $items = PublicationLog::where('user_id', $r->user()->id)->when($r->level, fn ($q, $l) => $q->where('level', $l))
            ->latest('id')->limit(100)->get()
            ->map(fn ($l) => ['id' => $l->id, 'level' => $l->level, 'event' => $l->event, 'message' => $l->message,
                'article_id' => $l->article_id, 'created_at' => $l->created_at->toIso8601String()]);
        return response()->json(['data' => $items]);
    }
}
