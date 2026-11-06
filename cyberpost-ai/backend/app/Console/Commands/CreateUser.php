<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\UserBootstrapper;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateUser extends Command
{
    protected $signature = 'cyberpost:user:create {email} {--name=} {--role=owner} {--password= : déconseillé (historique du shell) ; demandé de façon interactive sinon}';
    protected $description = 'Crée un compte d\'accès à l\'application (il n\'y a pas d\'inscription publique).';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));
        $password = $this->option('password') ?: $this->secret('Mot de passe (12 caractères minimum)');
        $v = Validator::make(['email' => $email, 'password' => $password, 'role' => $this->option('role')], [
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', Password::min(12)->letters()->numbers()],
            'role' => ['in:owner,viewer'],
        ]);
        if ($v->fails()) {
            foreach ($v->errors()->all() as $e) {
                $this->error($e);
            }
            return self::FAILURE;
        }
        $user = User::create(['name' => $this->option('name') ?: 'Hissein Banaye Hassan', 'email' => $email, 'password' => $password, 'role' => $this->option('role')]);
        UserBootstrapper::bootstrap($user);
        $this->info("Compte créé : {$user->email} (rôle {$user->role}). Paramètres, catégories et calendrier par défaut initialisés.");
        return self::SUCCESS;
    }
}
