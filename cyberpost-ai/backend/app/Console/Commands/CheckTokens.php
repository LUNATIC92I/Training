<?php

namespace App\Console\Commands;

use App\Services\Scheduling\Automation;
use Illuminate\Console\Command;

class CheckTokens extends Command
{
    protected $signature = 'cyberpost:check-tokens';
    protected $description = 'Vérifie l\'expiration des jetons LinkedIn et prévient l\'utilisateur.';

    public function handle(Automation $automation): int
    {
        foreach ($automation->checkTokens() as $line) {
            $this->line($line);
        }
        return self::SUCCESS;
    }
}
