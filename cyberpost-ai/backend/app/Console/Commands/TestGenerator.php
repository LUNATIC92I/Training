<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\User;
use App\Services\Scheduling\Automation;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class TestGenerator extends Command
{
    protected $signature = 'cyberpost:generate {email} {--category= : slug de catégorie}';
    protected $description = 'Génère immédiatement un article (sans le publier) et l\'affiche.';

    public function handle(Automation $automation): int
    {
        $user = User::where('email', $this->argument('email'))->firstOrFail();
        $a = Article::create(['user_id' => $user->id, 'title' => 'Article à la demande', 'status' => Article::GENERATING, 'language' => $user->settings->language]);
        $this->line($automation->generate($a, $this->option('category'), CarbonImmutable::now()));
        $a->refresh();
        if ($a->status === Article::GENERATION_FAILED) {
            $this->error($a->error);
            return self::FAILURE;
        }
        // Un article généré à la demande n'est jamais publié sans action explicite.
        if ($a->status === Article::APPROVED && ! $a->scheduled_for) {
            $a->update(['status' => Article::NEEDS_REVIEW]);
        }
        $this->info($a->title);
        $this->line($a->content);
        $this->line(implode(' ', array_map(fn ($t) => '#'.$t, $a->hashtags)));
        if ($a->quality_issues) {
            $this->warn('Contrôle qualité : '.implode(' | ', $a->quality_issues));
        }
        return self::SUCCESS;
    }
}
