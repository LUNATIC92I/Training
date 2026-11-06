<?php

use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Ordonnanceur CyberPost AI
|--------------------------------------------------------------------------
| Une seule entrée cron sur le serveur suffit :
|   * * * * * cd /chemin/backend && php artisan schedule:run >> /dev/null 2>&1
|
| - la génération et la publication sont deux commandes distinctes, chacune
|   protégée contre les exécutions concurrentes : une génération lente ne peut
|   jamais retarder la publication de 06h30 ;
| - onOneServer() évite les doublons si plusieurs serveurs partagent la base.
*/

Schedule::command('cyberpost:publish-due')->everyMinute()
    ->withoutOverlapping(10)->onOneServer()->runInBackground();

Schedule::command('cyberpost:generate-due')->everyMinute()
    ->withoutOverlapping(15)->onOneServer()->runInBackground();

Schedule::command('cyberpost:check-tokens')->dailyAt('08:05')->timezone('Africa/Abidjan')->onOneServer();

Schedule::command('model:prune', ['--model' => [\App\Models\PublicationLog::class]])->monthly();
