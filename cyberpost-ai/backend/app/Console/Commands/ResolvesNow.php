<?php

namespace App\Console\Commands;

use Carbon\CarbonImmutable;

trait ResolvesNow
{
    /** Heure courante, ou heure simulée (--now) hors production pour les tests de bout en bout. */
    protected function resolveNow(): CarbonImmutable
    {
        $opt = $this->hasOption('now') ? $this->option('now') : null;
        if ($opt) {
            if (app()->isProduction() || ! config('cyberpost.allow_time_travel')) {
                $this->warn('--now ignoré : simulation de l\'heure désactivée (CYBERPOST_ALLOW_TIME_TRAVEL).');
            } else {
                return CarbonImmutable::parse($opt, config('cyberpost.default_timezone'))->utc();
            }
        }
        return CarbonImmutable::now('UTC');
    }
}
