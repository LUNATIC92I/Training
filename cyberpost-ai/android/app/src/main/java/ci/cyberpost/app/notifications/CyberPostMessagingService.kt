package ci.cyberpost.app.notifications

import ci.cyberpost.app.CyberPostApp
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/** Réception des messages FCM envoyés par le backend (messages de données). */
class CyberPostMessagingService : FirebaseMessagingService() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onMessageReceived(message: RemoteMessage) {
        val d = message.data
        val title = d["title"] ?: message.notification?.title ?: "CyberPost AI"
        val body = d["body"] ?: message.notification?.body ?: return
        val id = d["notification_id"]?.toIntOrNull() ?: (System.currentTimeMillis() % Int.MAX_VALUE).toInt()
        NotificationHelper.show(this, id, title, body, d["level"] ?: "info", d["article_id"]?.toLongOrNull())
        scope.launch { (application as CyberPostApp).container.repository.syncNotifications() }
    }

    override fun onNewToken(token: String) {
        val app = application as CyberPostApp
        if (!app.container.session.isLoggedIn) return
        scope.launch { app.container.repository.registerDevice(token) }
    }
}
