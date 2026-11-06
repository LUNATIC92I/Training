package ci.cyberpost.app.data

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Stockage local de la session (URL du serveur, jeton d'accès à l'API du
 * backend, nom de l'utilisateur). Le jeton est chiffré en AES-256-GCM avec une
 * clé non exportable conservée dans l'Android Keystore.
 *
 * Aucun secret LinkedIn ni aucune clé d'API de génération n'est stocké sur le
 * téléphone : ils restent exclusivement sur le backend.
 */
class SessionStore(context: Context) {
    private val prefs = context.getSharedPreferences("cyberpost_session", Context.MODE_PRIVATE)

    var serverUrl: String?
        get() = prefs.getString(KEY_SERVER, null)
        set(value) = prefs.edit().putString(KEY_SERVER, value).apply()

    var userName: String?
        get() = prefs.getString(KEY_USER, null)
        set(value) = prefs.edit().putString(KEY_USER, value).apply()

    var userRole: String?
        get() = prefs.getString(KEY_ROLE, null)
        set(value) = prefs.edit().putString(KEY_ROLE, value).apply()

    var lastNotificationId: Long
        get() = prefs.getLong(KEY_LAST_NOTIF, 0L)
        set(value) = prefs.edit().putLong(KEY_LAST_NOTIF, value).apply()

    var token: String?
        get() = prefs.getString(KEY_TOKEN, null)?.let { decrypt(it) }
        set(value) {
            if (value == null) prefs.edit().remove(KEY_TOKEN).apply()
            else prefs.edit().putString(KEY_TOKEN, encrypt(value)).apply()
        }

    val isLoggedIn: Boolean get() = !serverUrl.isNullOrBlank() && !token.isNullOrBlank()

    fun clear() {
        prefs.edit().remove(KEY_TOKEN).remove(KEY_USER).remove(KEY_ROLE).remove(KEY_LAST_NOTIF).apply()
    }

    private fun key(): SecretKey {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (ks.getEntry(ALIAS, null) as? KeyStore.SecretKeyEntry)?.let { return it.secretKey }
        val gen = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        gen.init(
            KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build()
        )
        return gen.generateKey()
    }

    private fun encrypt(plain: String): String {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, key())
        val out = cipher.doFinal(plain.toByteArray(Charsets.UTF_8))
        return Base64.encodeToString(cipher.iv, Base64.NO_WRAP) + ":" + Base64.encodeToString(out, Base64.NO_WRAP)
    }

    private fun decrypt(stored: String): String? = runCatching {
        val (iv, data) = stored.split(":", limit = 2)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, key(), GCMParameterSpec(128, Base64.decode(iv, Base64.NO_WRAP)))
        String(cipher.doFinal(Base64.decode(data, Base64.NO_WRAP)), Charsets.UTF_8)
    }.getOrNull()

    companion object {
        private const val ALIAS = "cyberpost_session_key"
        private const val KEY_SERVER = "server_url"
        private const val KEY_TOKEN = "api_token"
        private const val KEY_USER = "user_name"
        private const val KEY_ROLE = "user_role"
        private const val KEY_LAST_NOTIF = "last_notification_id"
    }
}
