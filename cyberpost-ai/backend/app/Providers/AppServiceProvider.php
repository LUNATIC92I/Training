<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Date::use(CarbonImmutable::class);
        \Carbon\Carbon::setLocale('fr');
        CarbonImmutable::setLocale('fr');

        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        // Limitation des requêtes
        RateLimiter::for('login', fn (Request $r) => [
            Limit::perMinute(5)->by(strtolower((string) $r->input('email')).'|'.$r->ip()),
            Limit::perMinute(20)->by($r->ip()),
        ]);
        RateLimiter::for('api', fn (Request $r) => Limit::perMinute(120)->by($r->user()?->id ?: $r->ip()));
        RateLimiter::for('generation', fn (Request $r) => Limit::perHour(20)->by($r->user()?->id ?: $r->ip()));
        RateLimiter::for('publish', fn (Request $r) => Limit::perMinute(3)->by($r->user()?->id ?: $r->ip()));
    }
}
