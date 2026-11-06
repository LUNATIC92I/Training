package ci.cyberpost.app.ui.screens

import android.content.Context
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.SessionStore
import ci.cyberpost.app.data.remote.*
import ci.cyberpost.app.ui.Formatters
import ci.cyberpost.app.ui.components.*
import ci.cyberpost.app.ui.theme.Cp
import kotlinx.coroutines.launch

class SettingsViewModel(private val repo: Repository, val session: SessionStore) : ViewModel() {
    var settings by mutableStateOf<SettingsDto?>(null)
    var providers by mutableStateOf<List<ProviderDto>>(emptyList())
    var categories by mutableStateOf<List<CategoryDto>>(emptyList())
    var linkedin by mutableStateOf<LinkedInStatusDto?>(null)
    var logs by mutableStateOf<List<LogEntryDto>>(emptyList())
    var busy by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)
    var message by mutableStateOf<String?>(null)

    init { load() }

    fun load() {
        busy = true
        viewModelScope.launch {
            repo.settings().onSuccess { settings = it }.onFailure { error = it.message }
            repo.providers().onSuccess { providers = it }
            repo.categories().onSuccess { categories = it }
            refreshLinkedIn()
            repo.logs().onSuccess { logs = it }
            busy = false
        }
    }

    fun refreshLinkedIn() = viewModelScope.launch { repo.linkedinStatus().onSuccess { linkedin = it }.onFailure { error = it.message } }

    fun update(transform: (SettingsDto) -> SettingsDto) { settings = settings?.let(transform) }

    fun save() {
        val s = settings ?: return
        busy = true; error = null; message = null
        viewModelScope.launch {
            repo.saveSettings(s).onSuccess { settings = it; message = "Paramètres enregistrés." }.onFailure { error = it.message }
            busy = false
        }
    }

    fun toggleCategory(slug: String, enabled: Boolean) = viewModelScope.launch {
        repo.toggleCategory(slug, enabled).onSuccess { c -> categories = categories.map { if (it.slug == c.slug) c else it } }
            .onFailure { error = it.message }
    }

    fun connectLinkedIn(ctx: Context) = viewModelScope.launch {
        repo.linkedinConnectUrl()
            .onSuccess { url -> CustomTabsIntent.Builder().build().launchUrl(ctx, Uri.parse(url)) }
            .onFailure { error = it.message }
    }

    fun disconnectLinkedIn() = viewModelScope.launch {
        repo.linkedinDisconnect().onSuccess { message = it.message; refreshLinkedIn() }.onFailure { error = it.message }
    }

    fun logout(done: () -> Unit) = viewModelScope.launch { repo.logout(); done() }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SettingsScreen(vm: SettingsViewModel, onLoggedOut: () -> Unit) {
    val ctx = LocalContext.current
    val s = vm.settings
    val isOwner = vm.session.userRole == "owner"
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ScreenHeader("Paramètres", vm.session.userName?.let { "Connecté : $it" })
        if (vm.busy) LinearProgressIndicator(Modifier.fillMaxWidth(), color = Cp.Turquoise)
        vm.error?.let { ErrorBanner(it, vm::load) }
        vm.message?.let { Panel(accent = Cp.Green) { Text(it, color = Cp.White) } }

        // ------------------------------------------------------------ LinkedIn
        Panel(accent = levelColor(vm.linkedin?.status)) {
            SectionLabel("Compte LinkedIn")
            Spacer(Modifier.height(8.dp))
            val li = vm.linkedin
            Row(verticalAlignment = Alignment.CenterVertically) {
                StatusDot(levelColor(li?.status))
                Spacer(Modifier.width(8.dp))
                Text(
                    when (li?.status) {
                        "connected" -> "Connecté : ${li.name ?: ""}"
                        "expiring" -> "Connecté, jeton bientôt expiré"
                        "expired" -> "Jeton expiré : reconnexion nécessaire"
                        "not_configured" -> "Application LinkedIn non configurée sur le serveur"
                        null -> "Vérification de la connexion…"
                        else -> "Non connecté"
                    }, color = Cp.White,
                )
            }
            li?.message?.let { Text(it, color = Cp.Muted, style = MaterialTheme.typography.bodySmall) }
            li?.expiresAt?.let { KeyValue("Expiration du jeton", Formatters.short(it)) }
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (li?.status != "not_configured") Button(onClick = { vm.connectLinkedIn(ctx) }, enabled = isOwner) {
                    Text(if (li?.connected == true) "Reconnecter" else "Connecter mon LinkedIn")
                }
                if (li?.connected == true) OutlinedButton(onClick = vm::disconnectLinkedIn, enabled = isOwner) { Text("Déconnecter") }
                TextButton(onClick = { vm.refreshLinkedIn() }) { Text("Vérifier") }
            }
        }

        if (s == null) { if (!vm.busy) Text("Paramètres indisponibles.", color = Cp.Muted); return@Column }

        // ------------------------------------------------------------ publication
        Panel {
            SectionLabel("Programmation")
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(s.publishTime, { v -> vm.update { it.copy(publishTime = v) } }, label = { Text("Heure (HH:MM)") }, singleLine = true, modifier = Modifier.weight(1f))
                OutlinedTextField(s.timezone, { v -> vm.update { it.copy(timezone = v) } }, label = { Text("Fuseau horaire") }, singleLine = true, modifier = Modifier.weight(1.4f))
            }
            Spacer(Modifier.height(8.dp))
            Text("Jours de publication", color = Cp.Muted)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Formatters.weekdays.forEach { (n, label) ->
                    FilterChip(selected = n in s.publishDays, onClick = {
                        vm.update { it.copy(publishDays = if (n in it.publishDays) it.publishDays - n else (it.publishDays + n).sorted()) }
                    }, label = { Text(label.take(3)) })
                }
            }
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("Mode automatique", color = Cp.White)
                    Text(if (s.mode == "automatic") "Les articles conformes sont publiés sans validation."
                        else "Mode validation : chaque article attend votre approbation.", color = Cp.Muted, style = MaterialTheme.typography.bodySmall)
                }
                Switch(checked = s.mode == "automatic", onCheckedChange = { on -> vm.update { it.copy(mode = if (on) "automatic" else "validation") } })
            }
            OutlinedTextField(s.generationLeadMinutes.toString(), { v -> v.toIntOrNull()?.let { n -> vm.update { it.copy(generationLeadMinutes = n) } } },
                label = { Text("Génération avant publication (minutes)") }, singleLine = true, modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number))
        }

        // ------------------------------------------------------------ contenu
        Panel {
            SectionLabel("Contenu")
            Spacer(Modifier.height(8.dp))
            Choice("Langue", listOf("fr" to "Français", "en" to "Anglais"), s.language) { v -> vm.update { it.copy(language = v) } }
            Choice("Longueur", listOf("short" to "Courte", "medium" to "Moyenne", "long" to "Longue", "variable" to "Variable"), s.articleLength) { v -> vm.update { it.copy(articleLength = v) } }
            Choice("Ton", listOf("pedagogue" to "Pédagogue", "analytique" to "Analytique", "direct" to "Direct", "conversationnel" to "Conversationnel"), s.tone) { v -> vm.update { it.copy(tone = v) } }
            Text("Hashtags : ${s.hashtagsCount}", color = Cp.Muted)
            Slider(value = s.hashtagsCount.toFloat(), onValueChange = { v -> vm.update { it.copy(hashtagsCount = v.toInt()) } }, valueRange = 0f..10f, steps = 9)
            Choice("Fournisseur de génération", vm.providers.map { it.key to (it.name + if (it.configured) "" else " (non configuré)") }, s.llmProvider) { v -> vm.update { it.copy(llmProvider = v) } }
        }

        // ------------------------------------------------------------ profil éditorial
        Panel {
            SectionLabel("Profil éditorial")
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(s.authorName, { v -> vm.update { it.copy(authorName = v) } }, label = { Text("Nom de l'auteur") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(s.authorTitle, { v -> vm.update { it.copy(authorTitle = v) } }, label = { Text("Fonction") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(s.authorDomain, { v -> vm.update { it.copy(authorDomain = v) } }, label = { Text("Domaines d'expertise") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(s.authorPositioning, { v -> vm.update { it.copy(authorPositioning = v) } }, label = { Text("Positionnement éditorial") }, modifier = Modifier.fillMaxWidth(), minLines = 3)
            OutlinedTextField(s.customInstructions ?: "", { v -> vm.update { it.copy(customInstructions = v) } }, label = { Text("Consignes éditoriales supplémentaires") }, modifier = Modifier.fillMaxWidth(), minLines = 3)
            Text("Le moteur n'invente jamais d'expériences, de réalisations ou de certifications : seules les informations saisies ici sont utilisées.",
                style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
        }
        Button(onClick = vm::save, enabled = isOwner && !vm.busy, modifier = Modifier.fillMaxWidth().height(48.dp)) { Text("Enregistrer les paramètres") }

        // ------------------------------------------------------------ catégories
        Panel {
            SectionLabel("Catégories éditoriales")
            vm.categories.groupBy { it.group }.forEach { (group, cats) ->
                Spacer(Modifier.height(8.dp))
                Text(group, color = Cp.Turquoise, style = MaterialTheme.typography.titleSmall)
                cats.forEach { c ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(c.name, Modifier.weight(1f), color = Cp.White)
                        Switch(checked = c.enabled, onCheckedChange = { vm.toggleCategory(c.slug, it) }, enabled = isOwner)
                    }
                }
            }
        }

        // ------------------------------------------------------------ journal
        Panel {
            SectionLabel("Journal des opérations")
            Spacer(Modifier.height(6.dp))
            if (vm.logs.isEmpty()) Text("Aucun événement.", color = Cp.Muted)
            vm.logs.take(30).forEach { l ->
                Row(Modifier.padding(vertical = 4.dp)) {
                    StatusDot(levelColor(l.level), 6, pulse = false)
                    Spacer(Modifier.width(8.dp))
                    Column {
                        Text(l.message, color = Cp.White, style = MaterialTheme.typography.bodySmall)
                        Text("${Formatters.short(l.createdAt)} · ${l.event}", color = Cp.Muted, style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }

        Panel {
            SectionLabel("Session")
            KeyValue("Serveur", vm.session.serverUrl?.removeSuffix("/api/v1/") ?: "–")
            KeyValue("Rôle", if (isOwner) "Propriétaire" else "Lecture seule")
            Spacer(Modifier.height(8.dp))
            OutlinedButton(onClick = { vm.logout(onLoggedOut) }) { Text("Se déconnecter", color = Cp.Red) }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun Choice(label: String, options: List<Pair<String, String>>, selected: String, onSelect: (String) -> Unit) {
    Text(label, color = Cp.Muted)
    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        options.forEach { (k, v) -> FilterChip(selected = k == selected, onClick = { onSelect(k) }, label = { Text(v) }) }
    }
    Spacer(Modifier.height(6.dp))
}
