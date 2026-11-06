<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppNotification extends Model
{
    protected $table = 'notifications';
    protected $fillable = ['user_id', 'type', 'title', 'body', 'level', 'article_id', 'dedupe_key', 'read_at', 'pushed_at', 'push_error'];
    protected function casts(): array { return ['read_at' => 'datetime', 'pushed_at' => 'datetime']; }
}
