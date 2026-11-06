<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $a = $this->resource;
        $full = ! $request->routeIs('articles.index');
        return array_filter([
            'id' => $a->id,
            'title' => $a->title,
            'category' => $a->category ? ['slug' => $a->category->slug, 'name' => $a->category->name] : null,
            'topic' => $a->topic,
            'content' => $full ? $a->content : null,
            'preview' => $full ? null : mb_substr(preg_replace('/\s+/', ' ', $a->content), 0, 160),
            'hashtags' => $a->hashtags ?? [],
            'sources' => $a->sources ?? [],
            'status' => $a->status,
            'language' => $a->language,
            'generated_at' => $a->generated_at?->toIso8601String(),
            'scheduled_for' => $a->scheduled_for?->toIso8601String(),
            'published_at' => $a->published_at?->toIso8601String(),
            'linkedin_post_urn' => $a->linkedin_post_urn,
            'linkedin_post_url' => $a->linkedinUrl(),
            'error' => $a->error,
            'quality' => ['score' => $a->quality_score, 'issues' => $a->quality_issues ?? []],
            'word_count' => $a->word_count,
        ], fn ($v) => $v !== null);
    }
}
