<?php

namespace App\Jobs;

use App\Models\Article;
use App\Services\Scheduling\Automation;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

/** Génération asynchrone déclenchée depuis l'application (génération ou régénération à la demande). */
class GenerateArticleJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public int $timeout = 600;

    public function __construct(public int $articleId, public ?string $category = null) {}

    public function handle(Automation $automation): void
    {
        $a = Article::find($this->articleId);
        if (! $a || $a->status !== Article::GENERATING) {
            return;
        }
        $automation->generate($a, $this->category, CarbonImmutable::now());
        // Une génération à la demande sans créneau n'est jamais publiée sans action explicite.
        $a->refresh();
        if ($a->status === Article::APPROVED && ! $a->scheduled_for) {
            $a->update(['status' => Article::NEEDS_REVIEW]);
        }
    }
}
