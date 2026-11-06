<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Publication extends Model
{
    public const PUBLISHING = 'publishing';
    public const PUBLISHED = 'published';
    public const RETRY_SCHEDULED = 'retry_scheduled';
    public const FAILED = 'failed';
    public const UNCERTAIN = 'uncertain';

    protected $fillable = ['user_id', 'article_id', 'idempotency_key', 'status', 'attempts', 'next_attempt_at', 'linkedin_post_urn',
        'http_status', 'last_error', 'trigger', 'started_at', 'published_at'];

    protected function casts(): array
    {
        return ['next_attempt_at' => 'datetime', 'started_at' => 'datetime', 'published_at' => 'datetime'];
    }

    public function article(): BelongsTo { return $this->belongsTo(Article::class); }
}
