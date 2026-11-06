<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationSetting extends Model
{
    protected $fillable = ['user_id', 'publish_time', 'publish_days', 'timezone', 'mode', 'article_length', 'tone', 'hashtags_count',
        'llm_provider', 'language', 'generation_lead_minutes', 'catch_up_window_minutes', 'author_name', 'author_title',
        'author_domain', 'author_positioning', 'custom_instructions'];

    protected function casts(): array
    {
        return ['publish_days' => 'array', 'hashtags_count' => 'integer', 'generation_lead_minutes' => 'integer', 'catch_up_window_minutes' => 'integer'];
    }

    public function isAutomatic(): bool { return $this->mode === 'automatic'; }

    /** Jours de publication sous forme d'entiers ISO triés (1 = lundi). */
    public function days(): array
    {
        $d = array_values(array_unique(array_map('intval', $this->publish_days ?? [])));
        sort($d);
        return $d;
    }
}
