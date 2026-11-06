<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeviceToken extends Model
{
    protected $fillable = ['user_id', 'token', 'token_hash', 'platform', 'last_seen_at'];
    protected $hidden = ['token'];
    protected function casts(): array { return ['token' => 'encrypted', 'last_seen_at' => 'datetime']; }
}
