<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\EditorialCategory;
use App\Models\PublicationSchedule;
use App\Services\Content\TopicSelector;
use App\Services\Scheduling\ScheduleCalculator;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    private const LABELS = [1 => 'Lundi', 2 => 'Mardi', 3 => 'Mercredi', 4 => 'Jeudi', 5 => 'Vendredi', 6 => 'Samedi', 7 => 'Dimanche'];

    public function show(Request $r, ScheduleCalculator $calc, TopicSelector $topics)
    {
        $user = $r->user();
        $s = $user->settings;
        $rows = PublicationSchedule::where('user_id', $user->id)->get()->keyBy('weekday');
        $days = collect(range(1, 7))->map(fn ($d) => [
            'weekday' => $d, 'label' => self::LABELS[$d], 'enabled' => in_array($d, $s->days(), true),
            'categories' => $rows[$d]->category_slugs ?? [],
        ]);
        $upcoming = collect($calc->upcoming($s, CarbonImmutable::now(), 10))->map(function (CarbonImmutable $slot) use ($user, $topics) {
            $a = Article::where('user_id', $user->id)->whereDate('slot_date', $slot->format('Y-m-d'))->first();
            return [
                'date' => $slot->format('Y-m-d'), 'label' => self::LABELS[$slot->dayOfWeekIso],
                'categories' => collect($topics->categoriesFor($user, $slot->dayOfWeekIso))->pluck('slug')->all(),
                'article_id' => $a?->id, 'article_title' => $a?->title, 'article_status' => $a?->status,
            ];
        });
        return response()->json(['data' => ['timezone' => $s->timezone, 'time' => $s->publish_time, 'days' => $days, 'upcoming' => $upcoming]]);
    }

    public function update(Request $r, ScheduleCalculator $calc, TopicSelector $topics)
    {
        $user = $r->user();
        $slugs = EditorialCategory::where('user_id', $user->id)->pluck('slug')->all();
        $data = $r->validate([
            'days' => ['required', 'array', 'max:7'],
            'days.*.weekday' => ['required', 'integer', 'between:1,7'],
            'days.*.categories' => ['present', 'array'],
            'days.*.categories.*' => ['string', 'in:'.implode(',', $slugs)],
        ]);
        foreach ($data['days'] as $d) {
            PublicationSchedule::updateOrCreate(['user_id' => $user->id, 'weekday' => $d['weekday']], ['category_slugs' => array_values(array_unique($d['categories']))]);
        }
        return $this->show($r, $calc, $topics);
    }
}
