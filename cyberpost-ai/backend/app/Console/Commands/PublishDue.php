<?php

namespace App\Console\Commands;

use App\Services\Scheduling\Automation;
use Illuminate\Console\Command;

class PublishDue extends Command
{
    use ResolvesNow;

    protected $signature = 'cyberpost:publish-due {--now= : Heure simulée (tests, hors production)}';
    protected $description = 'Publie sur LinkedIn les articles validés dont l\'heure est arrivée.';

    public function handle(Automation $automation): int
    {
        foreach ($automation->runPublishing($this->resolveNow()) as $line) {
            $this->line($line);
        }
        return self::SUCCESS;
    }
}
