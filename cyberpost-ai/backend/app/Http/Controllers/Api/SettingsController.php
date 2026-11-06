<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Services\Llm\LlmManager;
use App\Services\Notify\ActivityLog;
use App\Services\Scheduling\Automation;
use DateTimeZone;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{
    public static function present(ApplicationSetting $s): array
    {
        return [
            'publish_time' => $s->publish_time, 'publish_days' => $s->days(), 'timezone' => $s->timezone, 'mode' => $s->mode,
            'article_length' => $s->article_length, 'tone' => $s->tone, 'hashtags_count' => $s->hashtags_count,
            'llm_provider' => $s->llm_provider, 'language' => $s->language, 'generation_lead_minutes' => $s->generation_lead_minutes,
            'author_name' => $s->author_name, 'author_title' => $s->author_title, 'author_domain' => $s->author_domain,
            'author_positioning' => (string) $s->author_positioning, 'custom_instructions' => $s->custom_instructions,
        ];
    }

    public function show(Request $r)
    {
        return response()->json(['data' => self::present($r->user()->settings)]);
    }

    public function update(Request $r, LlmManager $llm, Automation $automation, ActivityLog $log)
    {
        $data = $r->validate([
            'publish_time' => ['required', 'regex:/^([01]\d|2[0-3]):[0-5]\d$/'],
            'publish_days' => ['required', 'array', 'max:7'],
            'publish_days.*' => ['integer', 'between:1,7', 'distinct'],
            'timezone' => ['required', Rule::in(DateTimeZone::listIdentifiers())],
            'mode' => ['required', 'in:automatic,validation'],
            'article_length' => ['required', 'in:short,medium,long,variable'],
            'tone' => ['required', 'in:pedagogue,analytique,direct,conversationnel'],
            'hashtags_count' => ['required', 'integer', 'between:0,10'],
            'llm_provider' => ['required', Rule::in($llm->keys())],
            'language' => ['required', 'in:fr,en'],
            'generation_lead_minutes' => ['required', 'integer', 'between:10,1440'],
            'author_name' => ['required', 'string', 'max:120'],
            'author_title' => ['nullable', 'string', 'max:120'],
            'author_domain' => ['nullable', 'string', 'max:500'],
            'author_positioning' => ['nullable', 'string', 'max:1000'],
            'custom_instructions' => ['nullable', 'string', 'max:2000'],
        ], [], ['publish_time' => 'heure de publication', 'timezone' => 'fuseau horaire']);
        $data['author_title'] ??= '';
        $data['author_domain'] ??= '';
        $s = $r->user()->settings;
        $s->update($data);
        $automation->reschedule($r->user());
        $log->info($r->user(), 'settings_updated', 'Paramètres mis à jour.');
        return response()->json(['data' => self::present($s->fresh())]);
    }

    public function providers(LlmManager $llm)
    {
        return response()->json(['data' => $llm->catalog()]);
    }
}
