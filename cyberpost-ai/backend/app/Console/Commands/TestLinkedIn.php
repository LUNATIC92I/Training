<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\LinkedIn\LinkedInClient;
use App\Services\LinkedIn\LinkedInException;
use Illuminate\Console\Command;

class TestLinkedIn extends Command
{
    protected $signature = 'cyberpost:linkedin:check {email}';
    protected $description = 'Vérifie le jeton LinkedIn d\'un compte (sans rien publier).';

    public function handle(LinkedInClient $client): int
    {
        $acc = User::where('email', $this->argument('email'))->firstOrFail()->linkedinAccount;
        if (! $acc) {
            $this->error('Aucun compte LinkedIn connecté.');
            return self::FAILURE;
        }
        try {
            $info = $client->userinfo($acc->access_token);
            $acc->update(['last_verified_at' => now()]);
            $this->info("Jeton valide pour {$info['name']} ({$acc->person_urn}). Permissions : {$acc->scopes}");
            if (! $acc->hasScope('w_member_social')) {
                $this->warn('La permission w_member_social est absente : la publication sera refusée.');
            }
            return self::SUCCESS;
        } catch (LinkedInException $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }
    }
}
