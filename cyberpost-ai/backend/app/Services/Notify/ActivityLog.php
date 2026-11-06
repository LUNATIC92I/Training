<?php

namespace App\Services\Notify;

use App\Models\Article;
use App\Models\PublicationLog;
use App\Models\User;
use App\Support\Redactor;
use Illuminate\Support\Facades\Log;

/** Journal métier (table publication_logs + journal applicatif), secrets masqués. */
class ActivityLog
{
    public function info(?User $u, string $event, string $msg, ?Article $a = null, array $ctx = []): void { $this->write('info', $u, $event, $msg, $a, $ctx); }
    public function warning(?User $u, string $event, string $msg, ?Article $a = null, array $ctx = []): void { $this->write('warning', $u, $event, $msg, $a, $ctx); }
    public function error(?User $u, string $event, string $msg, ?Article $a = null, array $ctx = []): void { $this->write('error', $u, $event, $msg, $a, $ctx); }
    public function success(?User $u, string $event, string $msg, ?Article $a = null, array $ctx = []): void { $this->write('success', $u, $event, $msg, $a, $ctx); }

    private function write(string $level, ?User $u, string $event, string $msg, ?Article $a, array $ctx): void
    {
        $msg = Redactor::redact($msg);
        $ctx = Redactor::redactArray($ctx);
        PublicationLog::create([
            'user_id' => $u?->id, 'article_id' => $a?->id, 'level' => $level, 'event' => $event,
            'message' => mb_substr($msg, 0, 2000), 'context' => $ctx ?: null, 'created_at' => now(),
        ]);
        Log::log($level === 'success' ? 'info' : $level, "[$event] $msg", $ctx + ['user_id' => $u?->id, 'article_id' => $a?->id]);
    }
}
