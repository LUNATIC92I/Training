package ci.cyberpost.app.data.remote

import ci.cyberpost.app.BuildConfig
import ci.cyberpost.app.data.SessionStore
import kotlinx.serialization.json.Json
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.io.IOException
import java.util.concurrent.TimeUnit

val AppJson = Json {
    ignoreUnknownKeys = true
    explicitNulls = false
    coerceInputValues = true
    encodeDefaults = true
}

/**
 * Fabrique le client Retrofit pour l'URL configurée. Le jeton est ajouté par
 * un intercepteur ; le journal HTTP n'est actif qu'en debug et masque
 * l'en-tête Authorization.
 */
class ApiClient(private val session: SessionStore, private val onUnauthorized: () -> Unit) {
    @Volatile private var cached: Pair<String, CyberPostApi>? = null

    fun api(): CyberPostApi {
        val base = session.serverUrl ?: throw IllegalStateException("Serveur non configuré")
        cached?.let { if (it.first == base) return it.second }
        return build(base).also { cached = base to it }
    }

    fun build(baseUrl: String): CyberPostApi {
        val auth = Interceptor { chain ->
            val req = chain.request().newBuilder()
                .header("Accept", "application/json")
                .header("Accept-Language", "fr")
                .apply { session.token?.let { header("Authorization", "Bearer $it") } }
                .build()
            val res = chain.proceed(req)
            if (res.code == 401 && !req.url.encodedPath.endsWith("auth/login")) onUnauthorized()
            res
        }
        val client = OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)
            .readTimeout(90, TimeUnit.SECONDS) // la génération d'un article peut prendre du temps
            .writeTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(auth)
            .apply {
                if (BuildConfig.DEBUG) addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.BASIC
                    redactHeader("Authorization")
                })
            }
            .build()
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(AppJson.asConverterFactory("application/json".toMediaType()))
            .build()
            .create(CyberPostApi::class.java)
    }
}

/** Traduit une exception réseau ou HTTP en message lisible en français. */
fun Throwable.userMessage(): String = when (this) {
    is HttpException -> {
        val body = runCatching { response()?.errorBody()?.string() }.getOrNull()
        val msg = body?.let { runCatching { AppJson.decodeFromString(ApiErrorDto.serializer(), it).message }.getOrNull() }
        when {
            !msg.isNullOrBlank() -> msg
            code() == 401 -> "Session expirée : reconnectez-vous."
            code() == 403 -> "Action non autorisée pour votre rôle."
            code() == 429 -> "Trop de requêtes : réessayez dans un instant."
            code() >= 500 -> "Erreur du serveur (${code()})."
            else -> "Erreur ${code()}."
        }
    }
    is IOException -> "Serveur injoignable. Vérifiez votre connexion et l'adresse du serveur."
    else -> message ?: "Erreur inattendue."
}
