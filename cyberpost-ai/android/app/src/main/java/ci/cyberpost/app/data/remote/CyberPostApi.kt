package ci.cyberpost.app.data.remote

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

/** Contrat Retrofit de l'API REST CyberPost AI (préfixe /api/v1). */
interface CyberPostApi {
    @POST("auth/login") suspend fun login(@Body body: LoginRequest): LoginResponse
    @POST("auth/logout") suspend fun logout(): ActionResultDto
    @GET("me") suspend fun me(): DataWrapper<UserDto>

    @GET("dashboard") suspend fun dashboard(): DataWrapper<DashboardDto>

    @GET("articles") suspend fun articles(@Query("page") page: Int = 1, @Query("status") status: String? = null): ArticlePageDto
    @GET("articles/{id}") suspend fun article(@Path("id") id: Long): DataWrapper<ArticleDto>
    @PUT("articles/{id}") suspend fun updateArticle(@Path("id") id: Long, @Body body: ArticleUpdateRequest): DataWrapper<ArticleDto>
    @DELETE("articles/{id}") suspend fun deleteArticle(@Path("id") id: Long): ActionResultDto
    @POST("articles/generate") suspend fun generate(@Body body: GenerateRequest): ActionResultDto
    @POST("articles/{id}/regenerate") suspend fun regenerate(@Path("id") id: Long): ActionResultDto
    @POST("articles/{id}/approve") suspend fun approve(@Path("id") id: Long): ActionResultDto
    @POST("articles/{id}/publish-now") suspend fun publishNow(@Path("id") id: Long): ActionResultDto
    @POST("articles/{id}/schedule") suspend fun schedule(@Path("id") id: Long, @Body body: ScheduleRequest): ActionResultDto
    @POST("articles/{id}/resolve") suspend fun resolve(@Path("id") id: Long, @Body body: ResolveRequest): ActionResultDto

    @GET("calendar") suspend fun calendar(): DataWrapper<CalendarDto>
    @PUT("calendar") suspend fun updateCalendar(@Body body: CalendarUpdateRequest): DataWrapper<CalendarDto>
    @GET("categories") suspend fun categories(): DataWrapper<List<CategoryDto>>
    @PUT("categories/{slug}") suspend fun toggleCategory(@Path("slug") slug: String, @Body body: CategoryToggleRequest): DataWrapper<CategoryDto>

    @GET("settings") suspend fun settings(): DataWrapper<SettingsDto>
    @PUT("settings") suspend fun updateSettings(@Body body: SettingsDto): DataWrapper<SettingsDto>
    @GET("providers") suspend fun providers(): DataWrapper<List<ProviderDto>>

    @GET("linkedin/status") suspend fun linkedinStatus(): DataWrapper<LinkedInStatusDto>
    @POST("linkedin/connect") suspend fun linkedinConnect(): DataWrapper<LinkedInConnectDto>
    @POST("linkedin/disconnect") suspend fun linkedinDisconnect(): ActionResultDto

    @GET("notifications") suspend fun notifications(@Query("since_id") sinceId: Long? = null): DataWrapper<List<NotificationDto>>
    @POST("notifications/{id}/read") suspend fun markRead(@Path("id") id: Long): ActionResultDto
    @POST("notifications/read-all") suspend fun markAllRead(): ActionResultDto

    @POST("devices") suspend fun registerDevice(@Body body: DeviceRequest): ActionResultDto
    @GET("push-config") suspend fun pushConfig(): DataWrapper<PushConfigDto>
    @GET("logs") suspend fun logs(@Query("level") level: String? = null): DataWrapper<List<LogEntryDto>>
}
