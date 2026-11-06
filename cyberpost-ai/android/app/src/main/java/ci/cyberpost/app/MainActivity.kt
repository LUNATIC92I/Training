package ci.cyberpost.app

import android.Manifest
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import ci.cyberpost.app.notifications.PushManager
import ci.cyberpost.app.notifications.SyncWorker
import ci.cyberpost.app.ui.screens.*
import ci.cyberpost.app.ui.theme.Cp
import ci.cyberpost.app.ui.theme.CyberPostTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private val container by lazy { (application as CyberPostApp).container }
    private val pendingArticle = MutableStateFlow<Long?>(null)
    private val linkedinEvent = MutableStateFlow<String?>(null)

    private val notifPermission = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        handleIntent(intent)
        if (Build.VERSION.SDK_INT >= 33) notifPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
        if (container.session.isLoggedIn) afterLogin()

        setContent {
            CyberPostTheme {
                Surface(color = Cp.Black, modifier = Modifier.fillMaxSize()) {
                    val nav = rememberNavController()
                    val expired by container.sessionExpired.collectAsState()
                    val article by pendingArticle.collectAsState()
                    val liEvent by linkedinEvent.collectAsState()
                    var loggedIn by remember { mutableStateOf(container.session.isLoggedIn) }

                    LaunchedEffect(expired) {
                        if (expired && loggedIn) {
                            container.repository.logout(); container.resetSessionFlag(); loggedIn = false
                            Toast.makeText(this@MainActivity, "Session expirée : reconnectez-vous.", Toast.LENGTH_LONG).show()
                        }
                    }
                    LaunchedEffect(article, loggedIn) {
                        if (loggedIn && article != null) { nav.navigate("article/$article"); pendingArticle.value = null }
                    }
                    LaunchedEffect(liEvent) {
                        liEvent?.let {
                            Toast.makeText(this@MainActivity, it, Toast.LENGTH_LONG).show()
                            linkedinEvent.value = null
                            if (loggedIn) nav.navigate("settings") { launchSingleTop = true }
                        }
                    }

                    if (!loggedIn) {
                        LoginScreen(viewModel(factory = factory { LoginViewModel(container.repository, container.session) })) {
                            loggedIn = true; afterLogin()
                        }
                    } else {
                        MainScaffold(nav) { loggedIn = false; SyncWorker.cancel(this@MainActivity) }
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    /** Gère l'ouverture depuis une notification ou le retour de la connexion LinkedIn (cyberpost://linkedin?status=...). */
    private fun handleIntent(intent: Intent?) {
        intent ?: return
        intent.getLongExtra(EXTRA_ARTICLE_ID, -1L).takeIf { it > 0 }?.let { pendingArticle.value = it }
        val data = intent.data ?: return
        if (data.scheme == "cyberpost" && data.host == "linkedin") {
            linkedinEvent.value = when (data.getQueryParameter("status")) {
                "success" -> "Compte LinkedIn connecté avec succès."
                else -> "Connexion LinkedIn refusée ou échouée : " + (data.getQueryParameter("message") ?: "raison inconnue")
            }
        }
    }

    private fun afterLogin() {
        SyncWorker.schedule(this)
        lifecycleScope.launch { PushManager.register(this@MainActivity, container.repository) }
    }

    private fun <T : ViewModel> factory(create: () -> T) = object : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST") override fun <VM : ViewModel> create(modelClass: Class<VM>): VM = create() as VM
    }

    private data class Tab(val route: String, val label: String, val icon: ImageVector)
    private val tabs = listOf(
        Tab("dashboard", "Tableau", Icons.Default.Dashboard),
        Tab("articles", "Articles", Icons.Default.Article),
        Tab("calendar", "Calendrier", Icons.Default.CalendarMonth),
        Tab("alerts", "Alertes", Icons.Default.Notifications),
        Tab("settings", "Paramètres", Icons.Default.Settings),
    )

    @Composable
    private fun MainScaffold(nav: NavHostController, onLoggedOut: () -> Unit) {
        val repo = container.repository
        val backStack by nav.currentBackStackEntryAsState()
        val route = backStack?.destination?.route
        Scaffold(
            containerColor = Cp.Black,
            bottomBar = {
                if (route?.startsWith("article/") != true) NavigationBar(containerColor = Cp.Night) {
                    tabs.forEach { t ->
                        NavigationBarItem(
                            selected = route == t.route,
                            onClick = { nav.navigate(t.route) { popUpTo("dashboard") { saveState = true }; launchSingleTop = true; restoreState = true } },
                            icon = { Icon(t.icon, contentDescription = t.label) },
                            label = { Text(t.label, maxLines = 1) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = Cp.Black, indicatorColor = Cp.Turquoise, selectedTextColor = Cp.Turquoise),
                        )
                    }
                }
            },
        ) { pad ->
            NavHost(nav, startDestination = "dashboard", modifier = Modifier.padding(pad).statusBarsPadding()) {
                composable("dashboard") {
                    DashboardScreen(viewModel(factory = factory { DashboardViewModel(repo) }),
                        onOpenArticle = { nav.navigate("article/$it") }, onOpenSettings = { nav.navigate("settings") })
                }
                composable("articles") { ArticlesScreen(viewModel(factory = factory { ArticlesViewModel(repo) })) { nav.navigate("article/$it") } }
                composable("calendar") { CalendarScreen(viewModel(factory = factory { CalendarViewModel(repo) })) { nav.navigate("article/$it") } }
                composable("alerts") { NotificationsScreen(viewModel(factory = factory { NotificationsViewModel(repo) })) { nav.navigate("article/$it") } }
                composable("settings") {
                    SettingsScreen(viewModel(factory = factory { SettingsViewModel(repo, container.session) }), onLoggedOut)
                }
                composable("article/{id}", arguments = listOf(navArgument("id") { type = NavType.LongType })) { entry ->
                    val id = entry.arguments!!.getLong("id")
                    ArticleDetailScreen(viewModel(key = "article-$id", factory = factory { ArticleDetailViewModel(repo, id) })) { nav.popBackStack() }
                }
            }
        }
    }

    companion object { const val EXTRA_ARTICLE_ID = "article_id" }
}
