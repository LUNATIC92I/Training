<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EditorialCategory extends Model
{
    protected $fillable = ['user_id', 'slug', 'name', 'group', 'description', 'topics', 'requires_sources', 'enabled', 'weight', 'last_used_at'];

    protected function casts(): array
    {
        return ['topics' => 'array', 'requires_sources' => 'boolean', 'enabled' => 'boolean', 'last_used_at' => 'datetime'];
    }

    public function articles(): HasMany { return $this->hasMany(Article::class); }
}
