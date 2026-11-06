<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\LinkedInAccount;
use App\Services\LinkedIn\LinkedInClient;
use App\Services\Llm\LlmManager;
use App\Services\Notify\FcmClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class Status extends Command
{
    protected $signature = 'cyberpost:status';
    protected $description = 'Diagnostic de la configuration et de l\'état du système.';

    public function handle(LlmManager $llm, LinkedInClient $li, FcmClient $fcm): int
    {
        $this->line('Base de données : '.DB::connection()->getDriverName());
        $this->line('LinkedIn (application) : '.($li->isConfigured() ? 'configurée' : 'NON configurée'));
        $this->line('Version API LinkedIn : '.config('cyberpost.linkedin.api_version'));
        foreach (LinkedInAccount::all() as $a) {
            $this->line("  compte {$a->name} : {$a->status}, expire le ".($a->expires_at?->toDateTimeString() ?? '?'));
        }
        foreach ($llm->catalog() as $p) {
            $this->line("Fournisseur {$p['key']} : ".($p['configured'] ? "configuré ({$p['model']})" : 'non configuré'));
        }
        $this->line('Notifications push FCM : '.($fcm->isConfigured() ? 'configurées' : 'non configurées'));
        foreach (DB::table('system_heartbeats')->get() as $h) {
            $this->line("Dernière exécution {$h->name} : {$h->last_run_at} UTC");
        }
        $this->line('Articles publiés : '.Article::where('status', Article::PUBLISHED)->count());
        return self::SUCCESS;
    }
}
