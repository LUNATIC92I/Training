<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EditorialCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    private function present(EditorialCategory $c): array
    {
        return ['slug' => $c->slug, 'name' => $c->name, 'group' => $c->group, 'enabled' => $c->enabled, 'topics_count' => count($c->topics ?? [])];
    }

    public function index(Request $r)
    {
        return response()->json(['data' => EditorialCategory::where('user_id', $r->user()->id)->orderBy('id')->get()->map(fn ($c) => $this->present($c))]);
    }

    public function update(Request $r, string $slug)
    {
        $c = EditorialCategory::where('user_id', $r->user()->id)->where('slug', $slug)->firstOrFail();
        $data = $r->validate(['enabled' => ['required', 'boolean']]);
        if (! $data['enabled'] && EditorialCategory::where('user_id', $r->user()->id)->where('enabled', true)->count() <= 1) {
            abort(422, 'Au moins une catégorie doit rester active.');
        }
        $c->update($data);
        return response()->json(['data' => $this->present($c)]);
    }
}
