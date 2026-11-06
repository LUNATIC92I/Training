package ci.cyberpost.app

import android.app.Application
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.SessionStore
import ci.cyberpost.app.data.local.LocalDb
import ci.cyberpost.app.data.remote.ApiClient
import ci.cyberpost.app.notifications.NotificationHelper
import ci.cyberpost.app.notifications.PushManager
import ci.cyberpost.app.notifications.SyncWorker
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/** Conteneur de dépendances (injection manuelle, sans framework). */
class AppContainer(app: Application) {
    val session = SessionStore(app)
    private val _sessionExpired = MutableStateFlow(false)
    val sessionExpired: StateFlow<Boolean> = _sessionExpired
    private val client = ApiClient(session) { _sessionExpired.value = true }
    val db = LocalDb.create(app)
    val repository = Repository(session, client, db)
    fun resetSessionFlag() { _sessionExpired.value = false }
}

class CyberPostApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        NotificationHelper.createChannels(this)
        PushManager.initFromCache(this)
        if (container.session.isLoggedIn) SyncWorker.schedule(this)
    }
}
