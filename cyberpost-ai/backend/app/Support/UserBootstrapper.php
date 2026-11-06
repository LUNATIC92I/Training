<?php

namespace App\Support;

use App\Models\ApplicationSetting;
use App\Models\EditorialCategory;
use App\Models\PublicationSchedule;
use App\Models\User;

/** Initialise les paramètres, catégories et calendrier par défaut d'un compte. */
class UserBootstrapper
{
    public static function bootstrap(User $user): void
    {
        ApplicationSetting::firstOrCreate(['user_id' => $user->id], [
            'publish_time' => '06:30',
            'publish_days' => [1, 2, 3, 4, 5],
            'timezone' => config('cyberpost.default_timezone', 'Africa/Abidjan'),
            'mode' => 'automatic',
            'article_length' => 'variable',
            'tone' => 'pedagogue',
            'hashtags_count' => 5,
            'llm_provider' => config('cyberpost.llm.default_provider', 'anthropic'),
            'language' => 'fr',
            'generation_lead_minutes' => 60,
            'catch_up_window_minutes' => 120,
            'author_name' => 'Hissein Banaye Hassan',
            'author_title' => 'Senior SOC Analyst',
            'author_domain' => 'Cybersécurité, SOC, Threat Intelligence, Incident Response et Security Operations',
            'author_positioning' => 'Professionnel expérimenté, pédagogue, analyste technique et passionné par le développement de la cybersécurité africaine.',
        ]);

        foreach (EditorialCatalog::categories() as [$slug, $name, $group, $requiresSources, $topics]) {
            EditorialCategory::firstOrCreate(['user_id' => $user->id, 'slug' => $slug], [
                'name' => $name, 'group' => $group, 'topics' => $topics, 'requires_sources' => $requiresSources, 'enabled' => true,
            ]);
        }
        foreach (EditorialCatalog::weeklyCalendar() as $weekday => $slugs) {
            PublicationSchedule::firstOrCreate(['user_id' => $user->id, 'weekday' => $weekday], ['category_slugs' => $slugs]);
        }
    }
}
