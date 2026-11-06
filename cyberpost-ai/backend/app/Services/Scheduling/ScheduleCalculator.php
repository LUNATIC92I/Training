<?php

namespace App\Services\Scheduling;

use App\Models\ApplicationSetting;
use Carbon\CarbonImmutable;

/**
 * Calculs d'horaires purs (sans base de données), dans le fuseau de
 * l'utilisateur (par défaut Africa/Abidjan, GMT sans heure d'été).
 */
class ScheduleCalculator
{
    /** Instant de publication pour une date locale donnée, ou null si le jour n'est pas actif. */
    public function slotOn(ApplicationSetting $s, CarbonImmutable $localDate): ?CarbonImmutable
    {
        $day = $localDate->setTimezone($s->timezone);
        if (! in_array($day->dayOfWeekIso, $s->days(), true)) {
            return null;
        }
        [$h, $m] = array_map('intval', explode(':', $s->publish_time));
        return $day->setTime($h, $m, 0);
    }

    /** Prochain créneau à partir de $now (inclus). */
    public function nextSlot(ApplicationSetting $s, CarbonImmutable $now): ?CarbonImmutable
    {
        $local = $now->setTimezone($s->timezone);
        for ($i = 0; $i <= 14; $i++) {
            $slot = $this->slotOn($s, $local->startOfDay()->addDays($i));
            if ($slot && $slot->gte($local->startOfMinute())) {
                return $slot;
            }
        }
        return null;
    }

    /** Prochains créneaux (pour le calendrier). @return CarbonImmutable[] */
    public function upcoming(ApplicationSetting $s, CarbonImmutable $now, int $count): array
    {
        $out = [];
        $local = $now->setTimezone($s->timezone);
        for ($i = 0; $i <= 30 && count($out) < $count; $i++) {
            $slot = $this->slotOn($s, $local->startOfDay()->addDays($i));
            if ($slot && $slot->gte($local->startOfMinute())) {
                $out[] = $slot;
            }
        }
        return $out;
    }

    /**
     * Créneau pour lequel la génération doit avoir lieu maintenant :
     * entre (créneau - avance de génération) et (créneau + fenêtre de rattrapage).
     */
    public function slotNeedingGeneration(ApplicationSetting $s, CarbonImmutable $now): ?CarbonImmutable
    {
        $local = $now->setTimezone($s->timezone);
        for ($i = -1; $i <= 2; $i++) {
            $slot = $this->slotOn($s, $local->startOfDay()->addDays($i));
            if (! $slot) {
                continue;
            }
            $start = $slot->subMinutes(max(5, $s->generation_lead_minutes));
            $end = $slot->addMinutes($s->catch_up_window_minutes);
            if ($local->gte($start) && $local->lt($end)) {
                return $slot;
            }
        }
        return null;
    }

    /** Début de la semaine (lundi 00h00 locale) contenant $now. */
    public function weekStart(ApplicationSetting $s, CarbonImmutable $now): CarbonImmutable
    {
        return $now->setTimezone($s->timezone)->startOfWeek(CarbonImmutable::MONDAY);
    }
}
