package ci.cyberpost.app.notifications

import android.content.Context
import android.util.Log
import ci.cyberpost.app.data.Repository
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume

/**
 * Initialise Firebase Cloud Messaging à partir de la configuration publique
 * fournie par le backend (aucun fichier google-services.json n'est embarqué
 * dans l'APK). Si FCM n'est pas configuré côté serveur, l'état est affiché
 * et la synchronisation périodique prend le relais.
 */
object PushManager {
    private const val PREFS = "cyberpost_push"

    /** Réinitialise Firebase au démarrage si une configuration a déjà été reçue. */
    fun initFromCache(context: Context) {
        val p = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val appId = p.getString("app_id", null) ?: return
        init(context, appId, p.getString("api_key", "")!!, p.getString("project_id", "")!!, p.getString("sender_id", "")!!)
    }

    private fun init(context: Context, appId: String, apiKey: String, projectId: String, senderId: String): Boolean = runCatching {
        if (FirebaseApp.getApps(context).isEmpty()) {
            FirebaseApp.initializeApp(
                context,
                FirebaseOptions.Builder().setApplicationId(appId).setApiKey(apiKey).setProjectId(projectId).setGcmSenderId(senderId).build()
            )
        }
        true
    }.getOrElse { Log.w("PushManager", "Initialisation Firebase impossible", it); false }

    /** @return true si l'appareil est enregistré pour les notifications push. */
    suspend fun register(context: Context, repo: Repository): Boolean {
        val cfg = repo.pushConfig().getOrNull() ?: return false
        if (!cfg.configured || cfg.applicationId == null) return false
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putString("app_id", cfg.applicationId).putString("api_key", cfg.apiKey)
            .putString("project_id", cfg.projectId).putString("sender_id", cfg.senderId).apply()
        if (!init(context, cfg.applicationId, cfg.apiKey.orEmpty(), cfg.projectId.orEmpty(), cfg.senderId.orEmpty())) return false
        val token = suspendCancellableCoroutine<String?> { cont ->
            runCatching {
                FirebaseMessaging.getInstance().token
                    .addOnSuccessListener { cont.resume(it) }
                    .addOnFailureListener { cont.resume(null) }
            }.onFailure { cont.resume(null) }
        } ?: return false
        return repo.registerDevice(token).isSuccess
    }
}
