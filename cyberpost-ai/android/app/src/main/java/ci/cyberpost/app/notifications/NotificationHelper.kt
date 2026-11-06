package ci.cyberpost.app.notifications

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import ci.cyberpost.app.MainActivity
import ci.cyberpost.app.R

/** Création des canaux et affichage des notifications Android locales. */
object NotificationHelper {
    const val CHANNEL_PUBLICATIONS = "publications"
    const val CHANNEL_ALERTS = "alertes"

    fun createChannels(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = context.getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(NotificationChannel(CHANNEL_PUBLICATIONS, "Publications", NotificationManager.IMPORTANCE_DEFAULT).apply {
            description = "Articles générés, programmés et publiés"
        })
        nm.createNotificationChannel(NotificationChannel(CHANNEL_ALERTS, "Alertes", NotificationManager.IMPORTANCE_HIGH).apply {
            description = "Échecs de publication, jeton LinkedIn expiré, intervention nécessaire"
        })
    }

    /** level : success | info | warning | error (valeurs envoyées par le backend). */
    fun show(context: Context, id: Int, title: String, body: String, level: String, articleId: Long?) {
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) return
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            articleId?.let { putExtra(MainActivity.EXTRA_ARTICLE_ID, it) }
        }
        val pi = PendingIntent.getActivity(context, id, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val channel = if (level == "error" || level == "warning") CHANNEL_ALERTS else CHANNEL_PUBLICATIONS
        val n = NotificationCompat.Builder(context, channel)
            .setSmallIcon(R.drawable.ic_stat_cyberpost)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setColor(0xFF00D1C1.toInt())
            .setAutoCancel(true)
            .setContentIntent(pi)
            .setPriority(if (channel == CHANNEL_ALERTS) NotificationCompat.PRIORITY_HIGH else NotificationCompat.PRIORITY_DEFAULT)
            .build()
        runCatching { NotificationManagerCompat.from(context).notify(id, n) }
    }
}
