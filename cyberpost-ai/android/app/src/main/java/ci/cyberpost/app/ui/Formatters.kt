package ci.cyberpost.app.ui

import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

/** Formatage des dates renvoyées par le backend (ISO 8601) dans un fuseau donné. */
object Formatters {
    private val fr = Locale.FRENCH
    private val full = DateTimeFormatter.ofPattern("EEEE d MMMM yyyy 'à' HH'h'mm", fr)
    private val short = DateTimeFormatter.ofPattern("d MMM yyyy, HH'h'mm", fr)
    private val day = DateTimeFormatter.ofPattern("EEEE d MMMM", fr)

    fun parse(iso: String?): OffsetDateTime? = iso?.let { runCatching { OffsetDateTime.parse(it) }.getOrNull() }

    fun full(iso: String?, tz: String = "Africa/Abidjan"): String =
        parse(iso)?.atZoneSameInstant(zone(tz))?.format(full)?.replaceFirstChar { it.uppercase() } ?: "–"

    fun short(iso: String?, tz: String = "Africa/Abidjan"): String =
        parse(iso)?.atZoneSameInstant(zone(tz))?.format(short) ?: "–"

    fun dayLabel(isoDate: String): String = runCatching {
        java.time.LocalDate.parse(isoDate).format(day).replaceFirstChar { it.uppercase() }
    }.getOrDefault(isoDate)

    private fun zone(tz: String): ZoneId = runCatching { ZoneId.of(tz) }.getOrDefault(ZoneId.of("Africa/Abidjan"))

    val weekdays = listOf(1 to "Lundi", 2 to "Mardi", 3 to "Mercredi", 4 to "Jeudi", 5 to "Vendredi", 6 to "Samedi", 7 to "Dimanche")
}
