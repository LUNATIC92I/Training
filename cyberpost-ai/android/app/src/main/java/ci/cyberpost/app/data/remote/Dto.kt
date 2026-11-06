package ci.cyberpost.app.data.remote

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/*
 * Objets de transfert correspondant à l'API REST du backend CyberPost AI
 * (voir backend/docs/API.md). Les champs inconnus sont ignorés afin de
 * rester compatible avec les évolutions du backend.
 */

@Serializable
data class LoginRequest(val email: String, val password: String, @SerialName("device_name") val deviceName: String)

@Serializable
data class LoginResponse(val token: String, val user: UserDto)

@Serializable
data class UserDto(val id: Long, val name: String, val email: String, val role: String)

@Serializable
data class DataWrapper<T>(val data: T)

@Serializable
data class StatusDto(val level: String, val message: String)

@Serializable
data class LinkedInStatusDto(
    val status: String,
    val connected: Boolean,
    val configured: Boolean = true,
    val name: String? = null,
    @SerialName("expires_at") val expiresAt: String? = null,
    val message: String? = null,
)

@Serializable
data class NextPublicationDto(
    val at: String,
    @SerialName("local_date") val localDate: String,
    @SerialName("local_time") val localTime: String,
    val timezone: String,
    @SerialName("article_id") val articleId: Long? = null,
    @SerialName("article_status") val articleStatus: String? = null,
    @SerialName("article_title") val articleTitle: String? = null,
)

@Serializable
data class ScheduleDto(val time: String, val days: List<Int>, val timezone: String, val mode: String)

@Serializable
data class StatsDto(
    @SerialName("total_published") val totalPublished: Int,
    @SerialName("published_this_week") val publishedThisWeek: Int,
    @SerialName("failed_total") val failedTotal: Int,
    @SerialName("pending_review") val pendingReview: Int,
    @SerialName("generated_total") val generatedTotal: Int = 0,
)

@Serializable
data class LastPublicationDto(
    @SerialName("article_id") val articleId: Long,
    val title: String,
    @SerialName("published_at") val publishedAt: String?,
    @SerialName("linkedin_post_url") val linkedinPostUrl: String? = null,
)

@Serializable
data class ComponentStatusDto(
    val status: String,
    val message: String,
    val provider: String? = null,
    val configured: Boolean = false,
    @SerialName("last_tick_at") val lastTickAt: String? = null,
)

@Serializable
data class ErrorEntryDto(
    val at: String,
    val level: String,
    val message: String,
    @SerialName("article_id") val articleId: Long? = null,
)

@Serializable
data class DashboardDto(
    val status: StatusDto,
    val linkedin: LinkedInStatusDto,
    @SerialName("next_publication") val nextPublication: NextPublicationDto? = null,
    val schedule: ScheduleDto,
    val stats: StatsDto,
    @SerialName("last_publication") val lastPublication: LastPublicationDto? = null,
    val generator: ComponentStatusDto,
    val scheduler: ComponentStatusDto,
    val push: ComponentStatusDto,
    @SerialName("recent_errors") val recentErrors: List<ErrorEntryDto> = emptyList(),
)

@Serializable
data class CategoryRefDto(val slug: String, val name: String)

@Serializable
data class SourceDto(val title: String, val url: String, val date: String? = null)

@Serializable
data class QualityDto(val score: Int = 0, val issues: List<String> = emptyList())

@Serializable
data class ArticleDto(
    val id: Long,
    val title: String,
    val category: CategoryRefDto? = null,
    val topic: String? = null,
    val content: String = "",
    val hashtags: List<String> = emptyList(),
    val sources: List<SourceDto> = emptyList(),
    val status: String,
    @SerialName("status_label") val statusLabel: String? = null,
    val language: String = "fr",
    @SerialName("generated_at") val generatedAt: String? = null,
    @SerialName("scheduled_for") val scheduledFor: String? = null,
    @SerialName("published_at") val publishedAt: String? = null,
    @SerialName("linkedin_post_urn") val linkedinPostUrn: String? = null,
    @SerialName("linkedin_post_url") val linkedinPostUrl: String? = null,
    val error: String? = null,
    val quality: QualityDto = QualityDto(),
    @SerialName("word_count") val wordCount: Int = 0,
    val preview: String? = null,
)

@Serializable
data class PageMetaDto(
    @SerialName("current_page") val currentPage: Int,
    @SerialName("last_page") val lastPage: Int,
    val total: Int,
)

@Serializable
data class ArticlePageDto(val data: List<ArticleDto>, val meta: PageMetaDto)

@Serializable
data class ArticleUpdateRequest(
    val title: String,
    val content: String,
    val hashtags: List<String>,
)

@Serializable
data class GenerateRequest(
    @SerialName("category_slug") val categorySlug: String? = null,
)

@Serializable
data class ScheduleRequest(@SerialName("scheduled_for") val scheduledFor: String)

@Serializable
data class ResolveRequest(val published: Boolean, @SerialName("post_url") val postUrl: String? = null)

@Serializable
data class ActionResultDto(
    val ok: Boolean,
    val message: String,
    val article: ArticleDto? = null,
)

@Serializable
data class CategoryDto(
    val slug: String,
    val name: String,
    val group: String,
    val enabled: Boolean,
    @SerialName("topics_count") val topicsCount: Int = 0,
)

@Serializable
data class CategoryToggleRequest(val enabled: Boolean)

@Serializable
data class CalendarDayDto(val weekday: Int, val label: String, val enabled: Boolean, val categories: List<String>)

@Serializable
data class UpcomingSlotDto(
    val date: String,
    val label: String,
    val categories: List<String>,
    @SerialName("article_id") val articleId: Long? = null,
    @SerialName("article_title") val articleTitle: String? = null,
    @SerialName("article_status") val articleStatus: String? = null,
)

@Serializable
data class CalendarDto(
    val timezone: String,
    val time: String,
    val days: List<CalendarDayDto>,
    val upcoming: List<UpcomingSlotDto> = emptyList(),
)

@Serializable
data class CalendarUpdateRequest(val days: List<CalendarDayUpdate>)

@Serializable
data class CalendarDayUpdate(val weekday: Int, val categories: List<String>)

@Serializable
data class SettingsDto(
    @SerialName("publish_time") val publishTime: String,
    @SerialName("publish_days") val publishDays: List<Int>,
    val timezone: String,
    val mode: String,
    @SerialName("article_length") val articleLength: String,
    val tone: String,
    @SerialName("hashtags_count") val hashtagsCount: Int,
    @SerialName("llm_provider") val llmProvider: String,
    val language: String,
    @SerialName("generation_lead_minutes") val generationLeadMinutes: Int,
    @SerialName("author_name") val authorName: String,
    @SerialName("author_title") val authorTitle: String,
    @SerialName("author_domain") val authorDomain: String,
    @SerialName("author_positioning") val authorPositioning: String,
    @SerialName("custom_instructions") val customInstructions: String? = null,
)

@Serializable
data class ProviderDto(val key: String, val name: String, val configured: Boolean, val model: String? = null)

@Serializable
data class LinkedInConnectDto(@SerialName("authorization_url") val authorizationUrl: String)

@Serializable
data class NotificationDto(
    val id: Long,
    val type: String,
    val title: String,
    val body: String,
    val level: String,
    @SerialName("article_id") val articleId: Long? = null,
    @SerialName("read_at") val readAt: String? = null,
    @SerialName("created_at") val createdAt: String,
)

@Serializable
data class DeviceRequest(@SerialName("fcm_token") val fcmToken: String, val platform: String = "android")

@Serializable
data class PushConfigDto(
    val configured: Boolean,
    @SerialName("project_id") val projectId: String? = null,
    @SerialName("application_id") val applicationId: String? = null,
    @SerialName("api_key") val apiKey: String? = null,
    @SerialName("sender_id") val senderId: String? = null,
)

@Serializable
data class LogEntryDto(
    val id: Long,
    val level: String,
    val event: String,
    val message: String,
    @SerialName("article_id") val articleId: Long? = null,
    @SerialName("created_at") val createdAt: String,
)

@Serializable
data class ApiErrorDto(val message: String? = null)
