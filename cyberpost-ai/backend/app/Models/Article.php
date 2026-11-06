<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Article extends Model
{
    // Cycle de vie (voir docs/ARCHITECTURE.md)
    public const GENERATING = 'generating';
    public const GENERATION_FAILED = 'generation_failed';
    public const NEEDS_REVIEW = 'needs_review';
    public const APPROVED = 'approved';
    public const PUBLISHING = 'publishing';
    public const RETRY_SCHEDULED = 'retry_scheduled';
    public const PUBLISHED = 'published';
    public const FAILED = 'failed';
    public const UNCERTAIN = 'uncertain';

    /** Statuts dans lesquels le contenu peut encore être modifié. */
    public const EDITABLE = [self::GENERATION_FAILED, self::NEEDS_REVIEW, self::APPROVED, self::FAILED, self::RETRY_SCHEDULED];

    protected $fillable = ['user_id', 'editorial_category_id', 'topic', 'angle', 'title', 'content', 'hashtags', 'sources', 'language',
        'status', 'quality_score', 'quality_issues', 'word_count', 'content_hash', 'slot_date', 'scheduled_for', 'generated_at',
        'published_at', 'linkedin_post_urn', 'error', 'generation_attempts', 'next_generation_at', 'provider', 'model'];

    protected $attributes = ['hashtags' => '[]', 'sources' => '[]', 'quality_issues' => '[]', 'content' => ''];

    protected function casts(): array
    {
        return [
            'hashtags' => 'array', 'sources' => 'array', 'quality_issues' => 'array',
            'slot_date' => 'date:Y-m-d', 'scheduled_for' => 'datetime', 'generated_at' => 'datetime',
            'published_at' => 'datetime', 'next_generation_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(EditorialCategory::class, 'editorial_category_id'); }
    public function publication(): HasOne { return $this->hasOne(Publication::class); }

    public static function hashContent(string $content): string
    {
        $norm = mb_strtolower(preg_replace('/\s+/u', ' ', trim($content)));
        return hash('sha256', $norm);
    }

    public function linkedinUrl(): ?string
    {
        return $this->linkedin_post_urn ? 'https://www.linkedin.com/feed/update/'.$this->linkedin_post_urn.'/' : null;
    }
}
