<?php

namespace Tests\Unit;

use App\Models\ApplicationSetting;
use App\Services\Scheduling\ScheduleCalculator;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class ScheduleCalculatorTest extends TestCase
{
    private function settings(array $o = []): ApplicationSetting
    {
        return new ApplicationSetting(array_merge([
            'publish_time' => '06:30', 'publish_days' => [1, 2, 3, 4, 5], 'timezone' => 'Africa/Abidjan',
            'generation_lead_minutes' => 60, 'catch_up_window_minutes' => 120,
        ], $o));
    }

    #[Test] public function lundi_a_06h30_heure_dabidjan_soit_06h30_utc(): void
    {
        $slot = (new ScheduleCalculator)->slotOn($this->settings(), CarbonImmutable::parse('2026-11-09', 'Africa/Abidjan'));
        $this->assertSame('2026-11-09T06:30:00+00:00', $slot->utc()->toIso8601String());
    }

    #[Test] public function aucun_creneau_le_samedi_ni_le_dimanche(): void
    {
        $c = new ScheduleCalculator;
        $this->assertNull($c->slotOn($this->settings(), CarbonImmutable::parse('2026-11-07', 'Africa/Abidjan')));
        $this->assertNull($c->slotOn($this->settings(), CarbonImmutable::parse('2026-11-08', 'Africa/Abidjan')));
    }

    #[Test] public function apres_la_publication_du_vendredi_le_prochain_creneau_est_lundi(): void
    {
        $next = (new ScheduleCalculator)->nextSlot($this->settings(), CarbonImmutable::parse('2026-11-06 06:31', 'Africa/Abidjan'));
        $this->assertSame('2026-11-09 06:30', $next->format('Y-m-d H:i'));
        $this->assertSame(1, $next->dayOfWeekIso);
    }

    #[Test] public function cinq_creneaux_par_semaine_ouvree(): void
    {
        $up = (new ScheduleCalculator)->upcoming($this->settings(), CarbonImmutable::parse('2026-11-08 12:00', 'Africa/Abidjan'), 5);
        $this->assertSame(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13'], array_map(fn ($d) => $d->format('Y-m-d'), $up));
    }

    #[Test] public function changement_de_fuseau_horaire(): void
    {
        // 06:30 à Paris en heure d'hiver = 05:30 UTC ; à Abidjan = 06:30 UTC.
        $paris = (new ScheduleCalculator)->slotOn($this->settings(['timezone' => 'Europe/Paris']), CarbonImmutable::parse('2026-11-09', 'Europe/Paris'));
        $this->assertSame('05:30', $paris->utc()->format('H:i'));
        // Heure d'été parisienne : 04:30 UTC
        $summer = (new ScheduleCalculator)->slotOn($this->settings(['timezone' => 'Europe/Paris']), CarbonImmutable::parse('2026-06-15', 'Europe/Paris'));
        $this->assertSame('04:30', $summer->utc()->format('H:i'));
    }

    #[Test] public function fenetre_de_generation(): void
    {
        $c = new ScheduleCalculator;
        $s = $this->settings();
        $this->assertNull($c->slotNeedingGeneration($s, CarbonImmutable::parse('2026-11-09 05:29', 'Africa/Abidjan')));
        $this->assertSame('2026-11-09 06:30', $c->slotNeedingGeneration($s, CarbonImmutable::parse('2026-11-09 05:30', 'Africa/Abidjan'))->format('Y-m-d H:i'));
        $this->assertNotNull($c->slotNeedingGeneration($s, CarbonImmutable::parse('2026-11-09 08:29', 'Africa/Abidjan')));
        $this->assertNull($c->slotNeedingGeneration($s, CarbonImmutable::parse('2026-11-09 08:30', 'Africa/Abidjan')));
        $this->assertNull($c->slotNeedingGeneration($s, CarbonImmutable::parse('2026-11-07 05:45', 'Africa/Abidjan')), 'samedi');
    }

    #[Test] public function avance_de_generation_sur_la_veille(): void
    {
        // Mode validation : génération 12 h avant, donc la veille à 18h30.
        $s = $this->settings(['generation_lead_minutes' => 720]);
        $slot = (new ScheduleCalculator)->slotNeedingGeneration($s, CarbonImmutable::parse('2026-11-08 18:30', 'Africa/Abidjan'));
        $this->assertSame('2026-11-09 06:30', $slot->format('Y-m-d H:i'));
    }
}
