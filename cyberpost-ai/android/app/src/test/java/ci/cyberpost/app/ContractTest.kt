package ci.cyberpost.app

import ci.cyberpost.app.data.remote.*
import kotlinx.serialization.KSerializer
import kotlinx.serialization.builtins.ListSerializer
import org.junit.Assert.*
import org.junit.Test

/**
 * Tests de contrat : les fichiers JSON de src/test/resources/contract sont les
 * réponses réelles du backend, capturées par backend/tests/e2e/run-e2e.sh.
 * Ils garantissent que l'application interprète correctement l'API.
 */
class ContractTest {
    private fun <T> load(name: String, s: KSerializer<T>): T {
        val text = javaClass.classLoader!!.getResource("contract/$name")!!.readText()
        return AppJson.decodeFromString(s, text)
    }

    @Test fun login() {
        val r = load("login.json", LoginResponse.serializer())
        assertTrue(r.token.isNotBlank())
        assertEquals("owner", r.user.role)
    }

    @Test fun tableauDeBord() {
        val d = load("dashboard.json", DataWrapper.serializer(DashboardDto.serializer())).data
        assertEquals("green", d.status.level)
        assertEquals("06:30", d.schedule.time)
        assertEquals("Africa/Abidjan", d.schedule.timezone)
        assertEquals(listOf(1, 2, 3, 4, 5), d.schedule.days)
        assertEquals(1, d.stats.totalPublished)
        assertEquals("connected", d.linkedin.status)
        assertNotNull(d.nextPublication)
        assertTrue(d.lastPublication!!.linkedinPostUrl!!.startsWith("https://www.linkedin.com/feed/update/urn:li:share:"))
    }

    @Test fun articles() {
        val page = load("articles.json", ArticlePageDto.serializer())
        assertEquals(1, page.meta.total)
        val a = page.data.first()
        assertEquals("published", a.status)
        assertNotNull(a.preview)
        val full = load("article.json", DataWrapper.serializer(ArticleDto.serializer())).data
        assertTrue(full.content.endsWith("?"))
        assertEquals(5, full.hashtags.size)
        assertTrue(full.linkedinPostUrn!!.startsWith("urn:li:share:"))
        assertTrue(full.wordCount > 100)
    }

    @Test fun calendrierParametresCategories() {
        val cal = load("calendar.json", DataWrapper.serializer(CalendarDto.serializer())).data
        assertEquals(7, cal.days.size)
        assertFalse(cal.days.first { it.weekday == 6 }.enabled)
        assertTrue(cal.upcoming.isNotEmpty())
        val s = load("settings.json", DataWrapper.serializer(SettingsDto.serializer())).data
        assertEquals("Hissein Banaye Hassan", s.authorName)
        assertEquals("Senior SOC Analyst", s.authorTitle)
        assertEquals("fr", s.language)
        val cats = load("categories.json", DataWrapper.serializer(ListSerializer(CategoryDto.serializer()))).data
        assertTrue(cats.any { it.slug == "soc-analysis" } && cats.any { it.group == "Cybersécurité en Afrique" })
    }

    @Test fun notificationsJournauxFournisseurs() {
        val n = load("notifications.json", DataWrapper.serializer(ListSerializer(NotificationDto.serializer()))).data
        assertTrue(n.any { it.type == "published" && it.body.contains("06h30") })
        val logs = load("logs.json", DataWrapper.serializer(ListSerializer(LogEntryDto.serializer()))).data
        assertTrue(logs.isNotEmpty())
        val p = load("providers.json", DataWrapper.serializer(ListSerializer(ProviderDto.serializer()))).data
        assertTrue(p.any { it.key == "anthropic" })
        assertFalse(load("push_config.json", DataWrapper.serializer(PushConfigDto.serializer())).data.configured)
        val li = load("linkedin_status.json", DataWrapper.serializer(LinkedInStatusDto.serializer())).data
        assertTrue(li.connected)
    }

    @Test fun actionRefuseeDoublon() {
        val r = load("action_refused.json", ActionResultDto.serializer())
        assertFalse(r.ok)
        assertEquals("Cet article est déjà publié.", r.message)
    }
}
