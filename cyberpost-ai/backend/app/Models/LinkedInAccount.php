<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Compte LinkedIn connecté. Les jetons sont chiffrés en base (APP_KEY) et ne
 * sont jamais sérialisés dans les réponses de l'API.
 */
class LinkedInAccount extends Model
{
    protected $table = 'linkedin_accounts';

    protected $fillable = ['user_id', 'member_id', 'person_urn', 'name', 'email', 'access_token', 'refresh_token',
        'expires_at', 'refresh_expires_at', 'scopes', 'status', 'connected_at', 'last_verified_at', 'expiry_warned_at', 'last_error'];

    protected $hidden = ['access_token', 'refresh_token'];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'expires_at' => 'datetime',
            'refresh_expires_at' => 'datetime',
            'connected_at' => 'datetime',
            'last_verified_at' => 'datetime',
            'expiry_warned_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    public function isUsable(): bool
    {
        return $this->status === 'connected' && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    public function hasScope(string $scope): bool
    {
        return in_array($scope, preg_split('/[\s,]+/', (string) $this->scopes) ?: [], true);
    }
}
