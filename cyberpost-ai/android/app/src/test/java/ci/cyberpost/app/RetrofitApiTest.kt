package ci.cyberpost.app

import ci.cyberpost.app.data.remote.*
import kotlinx.coroutines.test.runTest
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

/** Vérifie les routes, méthodes HTTP et corps de requête de l'interface Retrofit. */
class RetrofitApiTest {
    private lateinit var server: MockWebServer
    private lateinit var api: CyberPostApi

    private fun json(name: String) = javaClass.classLoader!!.getResource("contract/$name")!!.readText()

    @Before fun setUp() {
        server = MockWebServer().apply { start() }
        api = Retrofit.Builder().baseUrl(server.url("/api/v1/"))
            .addConverterFactory(AppJson.asConverterFactory("application/json".toMediaType()))
            .build().create(CyberPostApi::class.java)
    }

    @After fun tearDown() = server.shutdown()

    @Test fun connexionPuisTableauDeBord() = runTest {
        server.enqueue(MockResponse().setBody(json("login.json")))
        server.enqueue(MockResponse().setBody(json("dashboard.json")))
        api.login(LoginRequest("e2e@cyberpost.test", "secret", "Pixel"))
        val login = server.takeRequest()
        assertEquals("POST", login.method)
        assertEquals("/api/v1/auth/login", login.path)
        assertTrue(login.body.readUtf8().contains("\"device_name\":\"Pixel\""))
        assertEquals("06:30", api.dashboard().data.schedule.time)
        assertEquals("/api/v1/dashboard", server.takeRequest().path)
    }

    @Test fun actionsSurUnArticle() = runTest {
        repeat(4) { server.enqueue(MockResponse().setBody("""{"ok":true,"message":"ok"}""")) }
        api.publishNow(12)
        assertEquals("/api/v1/articles/12/publish-now", server.takeRequest().path)
        api.schedule(12, ScheduleRequest("2026-11-10T06:30Z"))
        server.takeRequest().let { assertEquals("POST", it.method); assertTrue(it.body.readUtf8().contains("scheduled_for")) }
        api.resolve(12, ResolveRequest(false))
        assertEquals("/api/v1/articles/12/resolve", server.takeRequest().path)
        api.deleteArticle(12)
        assertEquals("DELETE", server.takeRequest().method)
    }

    @Test fun messageDerreurDuServeurAffiche() = runTest {
        server.enqueue(MockResponse().setResponseCode(422).setBody(json("action_refused.json")))
        val e = runCatching { api.publishNow(1) }.exceptionOrNull()
        assertTrue(e is HttpException)
        assertEquals("Cet article est déjà publié.", e!!.userMessage())
    }

    @Test fun parametresEnvoyesIntegralement() = runTest {
        server.enqueue(MockResponse().setBody(json("settings.json")))
        val s = api.settings().data
        server.takeRequest()
        server.enqueue(MockResponse().setBody(json("settings.json")))
        api.updateSettings(s.copy(publishTime = "07:00"))
        val body = server.takeRequest().body.readUtf8()
        assertTrue(body.contains("\"publish_time\":\"07:00\""))
        assertTrue(body.contains("\"timezone\":\"Africa/Abidjan\""))
        assertTrue(body.contains("\"author_name\":\"Hissein Banaye Hassan\""))
    }
}
