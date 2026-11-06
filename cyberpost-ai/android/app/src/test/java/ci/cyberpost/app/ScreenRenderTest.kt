package ci.cyberpost.app

import android.graphics.Bitmap
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.activity.ComponentActivity
import android.graphics.Canvas
import androidx.test.core.app.ApplicationProvider
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.SessionStore
import ci.cyberpost.app.data.local.LocalDb
import ci.cyberpost.app.data.remote.ApiClient
import ci.cyberpost.app.ui.screens.*
import ci.cyberpost.app.ui.theme.Cp
import ci.cyberpost.app.ui.theme.CyberPostTheme
import androidx.room.Room
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.io.File

/**
 * Rendu réel des écrans (Robolectric, rendu graphique natif) alimentés par un
 * serveur simulé qui renvoie les réponses capturées sur le vrai backend.
 * Les captures sont écrites dans build/screenshots pour revue visuelle.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(qualifiers = "w411dp-h891dp-xxhdpi", application = android.app.Application::class)
class ScreenRenderTest {
    @get:Rule val compose = createAndroidComposeRule<ComponentActivity>()
    private lateinit var server: MockWebServer
    private lateinit var repo: Repository
    private lateinit var db: LocalDb

    private fun json(name: String) = javaClass.classLoader!!.getResource("contract/$name")!!.readText()

    @Before fun setUp() {
        server = MockWebServer()
        server.dispatcher = object : Dispatcher() {
            override fun dispatch(request: RecordedRequest): MockResponse {
                val p = request.path!!.substringAfter("/api/v1/").substringBefore('?')
                val file = when {
                    p == "dashboard" -> "dashboard.json"
                    p == "articles" -> "articles.json"
                    p.startsWith("articles/") -> "article.json"
                    p == "calendar" -> "calendar.json"
                    p == "categories" -> "categories.json"
                    p == "settings" -> "settings.json"
                    p == "providers" -> "providers.json"
                    p == "linkedin/status" -> "linkedin_status.json"
                    p == "notifications" -> "notifications.json"
                    p == "logs" -> "logs.json"
                    else -> return MockResponse().setResponseCode(404).setBody("{\"message\":\"inconnu\"}")
                }
                return MockResponse().setBody(json(file)).addHeader("Content-Type", "application/json")
            }
        }
        server.start()
        val ctx = ApplicationProvider.getApplicationContext<android.app.Application>()
        val session = SessionStore(ctx).apply { serverUrl = server.url("/api/v1/").toString(); userName = "Hissein Banaye Hassan"; userRole = "owner" }
        db = Room.inMemoryDatabaseBuilder(ctx, LocalDb::class.java).allowMainThreadQueries().build()
        repo = Repository(session, ApiClient(session) {}, db)
    }

    @After fun tearDown() { server.shutdown(); db.close() }

    private fun render(name: String, content: @androidx.compose.runtime.Composable () -> Unit, waitText: String) {
        // Les pastilles de statut sont animées en continu : l'horloge de test est pilotée manuellement.
        compose.mainClock.autoAdvance = false
        compose.setContent { CyberPostTheme { Surface(color = Cp.Black, modifier = Modifier.fillMaxSize()) { Box { content() } } } }
        val deadline = System.currentTimeMillis() + 20_000
        while (compose.onAllNodesWithText(waitText, substring = true, ignoreCase = true).fetchSemanticsNodes().isEmpty()) {
            check(System.currentTimeMillis() < deadline) { "Texte attendu absent : $waitText\n" + compose.onRoot(useUnmergedTree = true).printToString(maxDepth = 30) }
            compose.mainClock.advanceTimeBy(100)
            Thread.sleep(50)
        }
        compose.mainClock.advanceTimeBy(600)
        compose.waitForIdle()
        val root = compose.activity.window.decorView
        val bmp = Bitmap.createBitmap(root.width, root.height, Bitmap.Config.ARGB_8888)
        root.draw(Canvas(bmp))
        val dir = File("build/screenshots").apply { mkdirs() }
        File(dir, "$name.png").outputStream().use { bmp.compress(Bitmap.CompressFormat.PNG, 100, it) }
    }

    @Test fun tableauDeBord() = render("01-tableau-de-bord", {
        DashboardScreen(DashboardViewModel(repo), {}, {})
    }, "Système opérationnel").also {
        compose.onNodeWithText("Prochaine publication", substring = true, ignoreCase = true).assertExists()
        compose.onNodeWithText("Articles publiés").assertExists()
    }

    @Test fun articles() = render("02-articles", { ArticlesScreen(ArticlesViewModel(repo)) {} }, "Escalader une alerte")

    @Test fun detailArticle() = render("03-article", {
        ArticleDetailScreen(ArticleDetailViewModel(repo, 1)) {}
    }, "Contenu de la publication")

    @Test fun calendrier() = render("04-calendrier", { CalendarScreen(CalendarViewModel(repo)) {} }, "Semaine type")

    @Test fun alertes() = render("05-alertes", { NotificationsScreen(NotificationsViewModel(repo)) {} }, "Publication réussie")

    @Test fun parametres() = render("06-parametres", { SettingsScreen(SettingsViewModel(repo, SessionStore(ApplicationProvider.getApplicationContext()))) {} }, "Connecté : Hissein")

    @Test fun connexion() = render("00-connexion", {
        LoginScreen(LoginViewModel(repo, SessionStore(ApplicationProvider.getApplicationContext()))) {}
    }, "Se connecter")
}
