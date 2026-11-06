<?php

namespace App\Models;

use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;

class PublicationLog extends Model
{
    use MassPrunable;

    public $timestamps = false;
    protected $fillable = ['user_id', 'article_id', 'level', 'event', 'message', 'context', 'created_at'];
    protected function casts(): array { return ['context' => 'array', 'created_at' => 'datetime']; }

    /** Conservation : 12 mois. */
    public function prunable() { return static::where('created_at', '<', now()->subYear()); }
}
