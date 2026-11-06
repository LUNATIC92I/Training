package ci.cyberpost.app.data

/**
 * Validation et normalisation de l'adresse du backend.
 * HTTPS est obligatoire, sauf pour les adresses de développement local
 * (émulateur 10.0.2.2, localhost) lorsque [allowLocalHttp] est vrai (build debug).
 */
object ServerUrl {
    private val localHosts = setOf("10.0.2.2", "localhost", "127.0.0.1")
    private val hostPattern = Regex("^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$")

    sealed interface Result {
        data class Valid(val baseUrl: String) : Result
        data class Invalid(val reason: String) : Result
    }

    fun normalize(input: String, allowLocalHttp: Boolean): Result {
        var url = input.trim()
        if (url.isEmpty()) return Result.Invalid("Indiquez l'adresse de votre serveur CyberPost AI.")
        if (!url.contains("://")) url = "https://$url"
        val scheme = url.substringBefore("://").lowercase()
        var rest = url.substringAfter("://").trimEnd('/')
        if (rest.endsWith("/api/v1")) rest = rest.removeSuffix("/api/v1")
        val authority = rest.substringBefore('/')
        val host = authority.substringBefore(':').lowercase()
        val port = authority.substringAfter(':', "")
        if (host.isEmpty() || !hostPattern.matches(host) || (!host.contains('.') && host !in localHosts)) {
            return Result.Invalid("Adresse invalide : indiquez un nom de domaine, par exemple cyberpost.example.com.")
        }
        if (port.isNotEmpty() && (port.toIntOrNull() ?: 0) !in 1..65535) return Result.Invalid("Port invalide.")
        when (scheme) {
            "https" -> Unit
            "http" -> if (!(allowLocalHttp && host in localHosts)) {
                return Result.Invalid("HTTPS est obligatoire pour protéger vos identifiants.")
            }
            else -> return Result.Invalid("Seules les adresses https:// sont acceptées.")
        }
        return Result.Valid("$scheme://$rest/api/v1/")
    }
}
