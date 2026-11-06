<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Jobs\GenerateArticleJob;
use App\Models\Article;
use App\Services\Content\QualityChecker;
use App\Services\Notify\ActivityLog;
use App\Services\Publishing\Publisher;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    private function find(Request $r, int $id): Article
    {
        return Article::where('user_id', $r->user()->id)->with('category')->findOrFail($id);
    }

    private function result(bool $ok, string $message, ?Article $a = null, int $code = 200)
    {
        return response()->json(['ok' => $ok, 'message' => $message, 'article' => $a ? new ArticleResource($a->fresh('category')) : null], $code);
    }

    public function index(Request $r)
    {
        $r->validate(['status' => ['nullable', 'string', 'max:30']]);
        $page = Article::where('user_id', $r->user()->id)->with('category')
            ->when($r->status, fn ($q, $s) => $q->where('status', $s))
            ->orderByRaw('COALESCE(scheduled_for, generated_at, created_at) DESC')->paginate(50);
        return response()->json([
            'data' => ArticleResource::collection($page->items())->resolve($r),
            'meta' => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'total' => $page->total()],
        ]);
    }

    public function show(Request $r, int $id)
    {
        return response()->json(['data' => new ArticleResource($this->find($r, $id))]);
    }

    public function update(Request $r, int $id, ActivityLog $log)
    {
        $a = $this->find($r, $id);
        abort_unless(in_array($a->status, Article::EDITABLE, true), 409, 'Cet article ne peut plus être modifié.');
        $data = $r->validate([
            'title' => ['required', 'string', 'max:250'],
            'content' => ['required', 'string', 'min:100', 'max:'.QualityChecker::MAX_CHARS],
            'hashtags' => ['array', 'max:10'],
            'hashtags.*' => ['string', 'max:60', 'regex:/^[\pL\pN_]+$/u'],
        ]);
        $hash = Article::hashContent($data['content']);
        abort_if(Article::where('user_id', $a->user_id)->where('id', '!=', $a->id)->where('content_hash', $hash)->exists(), 422, 'Un article identique existe déjà.');
        // Une modification humaine vaut relecture : les alertes du contrôle automatique sont levées.
        $a->update($data + ['content_hash' => $hash, 'word_count' => count(preg_split('/\s+/u', trim($data['content']))), 'quality_issues' => []]);
        $log->info($r->user(), 'article_edited', 'Article modifié manuellement.', $a);
        return response()->json(['data' => new ArticleResource($a->fresh('category'))]);
    }

    public function destroy(Request $r, int $id, ActivityLog $log)
    {
        $a = $this->find($r, $id);
        abort_if(in_array($a->status, [Article::PUBLISHING, Article::GENERATING], true), 409, 'Opération en cours sur cet article : réessayez dans un instant.');
        $log->info($r->user(), 'article_deleted', "Article supprimé : {$a->title}");
        $a->delete();
        return response()->json(['ok' => true, 'message' => 'Article supprimé.']);
    }

    public function generate(Request $r)
    {
        $data = $r->validate(['category_slug' => ['nullable', 'string', Rule::exists('editorial_categories', 'slug')->where('user_id', $r->user()->id)]]);
        $a = Article::create(['user_id' => $r->user()->id, 'title' => 'Génération en cours…', 'status' => Article::GENERATING, 'language' => $r->user()->settings->language]);
        GenerateArticleJob::dispatchAfterResponse($a->id, $data['category_slug'] ?? null);
        return $this->result(true, 'Génération lancée : l\'article sera disponible dans environ une minute.', $a, 202);
    }

    public function regenerate(Request $r, int $id)
    {
        $a = $this->find($r, $id);
        abort_unless(in_array($a->status, Article::EDITABLE, true), 409, 'Cet article ne peut plus être régénéré.');
        $a->update(['status' => Article::GENERATING, 'generation_attempts' => 0, 'error' => null, 'topic' => null]);
        GenerateArticleJob::dispatchAfterResponse($a->id, $a->category?->slug);
        return $this->result(true, 'Régénération lancée.', $a, 202);
    }

    public function approve(Request $r, int $id, ActivityLog $log)
    {
        $a = $this->find($r, $id);
        abort_unless($a->status === Article::NEEDS_REVIEW, 409, 'Seul un article en attente de validation peut être validé.');
        $a->update(['status' => Article::APPROVED, 'error' => null]);
        $log->info($r->user(), 'article_approved', 'Article validé.', $a);
        $msg = $a->scheduled_for ? 'Article validé : il sera publié automatiquement au créneau prévu.' : 'Article validé. Programmez-le ou publiez-le maintenant.';
        return $this->result(true, $msg, $a);
    }

    public function publishNow(Request $r, int $id, Publisher $publisher)
    {
        $a = $this->find($r, $id);
        $outcome = $publisher->publish($a, 'manual');
        return $this->result($outcome->ok, $outcome->message, $a, $outcome->ok ? 200 : 422);
    }

    public function schedule(Request $r, int $id, ActivityLog $log)
    {
        $a = $this->find($r, $id);
        abort_unless(in_array($a->status, Article::EDITABLE, true), 409, 'Cet article ne peut pas être programmé.');
        $data = $r->validate(['scheduled_for' => ['required', 'date', 'after:now']]);
        $at = CarbonImmutable::parse($data['scheduled_for'])->utc();
        $a->update([
            'scheduled_for' => $at, 'slot_date' => null, 'error' => null,
            // Programmer explicitement un article vaut validation humaine.
            'status' => Article::APPROVED,
        ]);
        $local = $at->setTimezone($r->user()->settings->timezone);
        $log->info($r->user(), 'article_scheduled', 'Article programmé pour le '.$local->format('d/m/Y H:i').'.', $a);
        return $this->result(true, 'Publication programmée le '.$local->translatedFormat('l j F \à H\hi').'.', $a);
    }

    public function resolve(Request $r, int $id, Publisher $publisher)
    {
        $a = $this->find($r, $id);
        $data = $r->validate(['published' => ['required', 'boolean'], 'post_url' => ['nullable', 'url', 'starts_with:https://www.linkedin.com/', 'max:500']]);
        $o = $publisher->resolve($a, $data['published'], $data['post_url'] ?? null);
        return $this->result($o->ok, $o->message, $a, $o->ok ? 200 : 409);
    }
}
