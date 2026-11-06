package ci.cyberpost.app.data

import ci.cyberpost.app.data.local.ArticleEntity
import ci.cyberpost.app.data.local.LocalDb
import ci.cyberpost.app.data.local.NotificationEntity
import ci.cyberpost.app.data.local.SnapshotEntity
import ci.cyberpost.app.data.remote.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/**
 * Point d'accès unique aux données : appels au backend et mise en cache Room.
 * Les méthodes renvoient un [Result] pour que les ViewModels affichent
 * l'erreur réelle au lieu de simuler un succès.
 */
class Repository(
    private val session: SessionStore,
    private val client: ApiClient,
    private val db: LocalDb,
) {
    private val dao get() = db.dao()
    private fun api() = client.api()

    private suspend fun <T> call(block: suspend () -> T): Result<T> =
        runCatching { block() }.recoverCatching { throw ApiFailure(it.userMessage(), it) }

    // ---------------------------------------------------------------- session
    suspend fun login(serverBaseUrl: String, email: String, password: String, deviceName: String): Result<UserDto> = call {
        val res = client.build(serverBaseUrl).login(LoginRequest(email.trim(), password, deviceName))
        session.serverUrl = serverBaseUrl
        session.token = res.token
        session.userName = res.user.name
        session.userRole = res.user.role
        res.user
    }

    suspend fun logout() {
        runCatching { api().logout() }
        session.clear()
        dao.clearArticles(); dao.clearNotifications(); dao.clearSnapshots()
    }

    // ---------------------------------------------------------------- tableau de bord
    suspend fun cachedDashboard(): DashboardDto? = dao.snapshot("dashboard")?.let {
        runCatching { AppJson.decodeFromString(DashboardDto.serializer(), it.json) }.getOrNull()
    }

    suspend fun dashboard(): Result<DashboardDto> = call {
        api().dashboard().data.also {
            dao.putSnapshot(SnapshotEntity("dashboard", AppJson.encodeToString(DashboardDto.serializer(), it), System.currentTimeMillis()))
        }
    }

    // ---------------------------------------------------------------- articles
    val articles: Flow<List<ArticleDto>> = dao.articles().map { list ->
        list.mapNotNull { runCatching { AppJson.decodeFromString(ArticleDto.serializer(), it.json) }.getOrNull() }
    }

    suspend fun refreshArticles(status: String? = null): Result<Int> = call {
        val page = api().articles(1, status)
        if (status == null) dao.clearArticles()
        cache(page.data)
        page.meta.total
    }

    suspend fun article(id: Long): Result<ArticleDto> = call { api().article(id).data.also { cache(listOf(it)) } }
    suspend fun cachedArticle(id: Long): ArticleDto? = dao.article(id)?.let { AppJson.decodeFromString(ArticleDto.serializer(), it.json) }

    suspend fun updateArticle(id: Long, title: String, content: String, hashtags: List<String>) =
        call { api().updateArticle(id, ArticleUpdateRequest(title, content, hashtags)).data.also { cache(listOf(it)) } }

    suspend fun deleteArticle(id: Long) = call { api().deleteArticle(id).also { dao.deleteArticle(id) } }
    suspend fun generate(category: String?) = action { api().generate(GenerateRequest(category)) }
    suspend fun regenerate(id: Long) = action { api().regenerate(id) }
    suspend fun approve(id: Long) = action { api().approve(id) }
    suspend fun publishNow(id: Long) = action { api().publishNow(id) }
    suspend fun schedule(id: Long, isoDateTime: String) = action { api().schedule(id, ScheduleRequest(isoDateTime)) }
    suspend fun resolve(id: Long, published: Boolean, url: String?) = action { api().resolve(id, ResolveRequest(published, url)) }

    private suspend fun action(block: suspend () -> ActionResultDto): Result<ActionResultDto> = call {
        block().also { r -> r.article?.let { cache(listOf(it)) } }
    }

    private suspend fun cache(items: List<ArticleDto>) {
        dao.upsertArticles(items.map {
            ArticleEntity(it.id, AppJson.encodeToString(ArticleDto.serializer(), it), it.status,
                (it.scheduledFor ?: it.generatedAt ?: "") + "#" + it.id.toString().padStart(10, '0'))
        })
    }

    // ---------------------------------------------------------------- calendrier, catégories, paramètres
    suspend fun calendar() = call { api().calendar().data }
    suspend fun updateCalendar(days: List<CalendarDayUpdate>) = call { api().updateCalendar(CalendarUpdateRequest(days)).data }
    suspend fun categories() = call { api().categories().data }
    suspend fun toggleCategory(slug: String, enabled: Boolean) = call { api().toggleCategory(slug, CategoryToggleRequest(enabled)).data }
    suspend fun settings() = call { api().settings().data }
    suspend fun saveSettings(s: SettingsDto) = call { api().updateSettings(s).data }
    suspend fun providers() = call { api().providers().data }
    suspend fun logs(level: String? = null) = call { api().logs(level).data }

    // ---------------------------------------------------------------- LinkedIn
    suspend fun linkedinStatus() = call { api().linkedinStatus().data }
    suspend fun linkedinConnectUrl() = call { api().linkedinConnect().data.authorizationUrl }
    suspend fun linkedinDisconnect() = call { api().linkedinDisconnect() }

    // ---------------------------------------------------------------- notifications
    val notifications: Flow<List<NotificationDto>> = dao.notifications().map { list ->
        list.mapNotNull { runCatching { AppJson.decodeFromString(NotificationDto.serializer(), it.json) }.getOrNull() }
    }

    /** Récupère les notifications et renvoie celles qui sont nouvelles depuis la dernière synchronisation. */
    suspend fun syncNotifications(): Result<List<NotificationDto>> = call {
        val all = api().notifications().data
        dao.upsertNotifications(all.map { NotificationEntity(it.id, AppJson.encodeToString(NotificationDto.serializer(), it), it.readAt != null) })
        val last = session.lastNotificationId
        val fresh = all.filter { it.id > last && it.readAt == null }
        all.maxOfOrNull { it.id }?.let { if (it > last) session.lastNotificationId = it }
        fresh
    }

    suspend fun markAllRead() = call { api().markAllRead().also { dao.markAllRead() } }
    suspend fun pushConfig() = call { api().pushConfig().data }
    suspend fun registerDevice(token: String) = call { api().registerDevice(DeviceRequest(token)) }
}

class ApiFailure(message: String, cause: Throwable) : Exception(message, cause)
