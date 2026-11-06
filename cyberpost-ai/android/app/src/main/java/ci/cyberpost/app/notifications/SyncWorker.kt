package ci.cyberpost.app.notifications

import android.content.Context
import androidx.work.*
import ci.cyberpost.app.CyberPostApp
import java.util.concurrent.TimeUnit

/**
 * Synchronisation périodique des notifications (toutes les 15 minutes,
 * minimum imposé par Android). Ce mécanisme sert de secours lorsque Firebase
 * Cloud Messaging n'est pas configuré : il ne participe PAS à la publication,
 * qui est entièrement assurée par l'ordonnanceur du backend.
 */
class SyncWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        val app = applicationContext as CyberPostApp
        if (!app.container.session.isLoggedIn) return Result.success()
        val fresh = app.container.repository.syncNotifications().getOrElse { return Result.retry() }
        fresh.take(5).forEach {
            NotificationHelper.show(applicationContext, it.id.toInt(), it.title, it.body, it.level, it.articleId)
        }
        return Result.success()
    }

    companion object {
        fun schedule(context: Context) {
            val req = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
                .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
                .build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork("notif-sync", ExistingPeriodicWorkPolicy.KEEP, req)
        }
        fun cancel(context: Context) = WorkManager.getInstance(context).cancelUniqueWork("notif-sync")
    }
}
