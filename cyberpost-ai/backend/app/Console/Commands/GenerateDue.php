<?php

namespace App\Console\Commands;

use App\Services\Scheduling\Automation;
use Illuminate\Console\Command;

class GenerateDue extends Command
{
    use ResolvesNow;

    protected $signature = 'cyberpost:generate-due {--now= : Heure simulée (tests, hors production)}';
    protected $description = 'Génère les articles des prochains créneaux de publication.';

    public function handle(Automation $automation): int
    {
        $now = $this->resolveNow();
        foreach ($automation->runGeneration($now) as $line) {
            $this->line($line);
        }
        return self::SUCCESS;
    }
}
