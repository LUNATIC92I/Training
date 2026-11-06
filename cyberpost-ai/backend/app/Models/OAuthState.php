<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OAuthState extends Model
{
    protected $table = 'oauth_states';
    protected $fillable = ['user_id', 'state_hash', 'expires_at', 'used_at'];
    protected function casts(): array { return ['expires_at' => 'datetime', 'used_at' => 'datetime']; }
}
