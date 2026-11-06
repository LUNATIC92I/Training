<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public const ROLE_OWNER = 'owner';
    public const ROLE_VIEWER = 'viewer';

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    /** Adresse e-mail toujours stockée en minuscules (connexion insensible à la casse). */
    protected function email(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(set: fn (string $v) => strtolower(trim($v)));
    }

    public function isOwner(): bool { return $this->role === self::ROLE_OWNER; }

    public function settings(): HasOne { return $this->hasOne(ApplicationSetting::class); }
    public function linkedinAccount(): HasOne { return $this->hasOne(LinkedInAccount::class); }
    public function articles(): HasMany { return $this->hasMany(Article::class); }
    public function categories(): HasMany { return $this->hasMany(EditorialCategory::class); }
    public function schedules(): HasMany { return $this->hasMany(PublicationSchedule::class); }
    public function appNotifications(): HasMany { return $this->hasMany(AppNotification::class); }
    public function deviceTokens(): HasMany { return $this->hasMany(DeviceToken::class); }
}
