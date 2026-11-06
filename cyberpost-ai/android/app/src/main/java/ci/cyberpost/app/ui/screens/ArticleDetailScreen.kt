package ci.cyberpost.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.remote.ActionResultDto
import ci.cyberpost.app.data.remote.ArticleDto
import ci.cyberpost.app.ui.Formatters
import ci.cyberpost.app.ui.components.*
import ci.cyberpost.app.ui.theme.Cp
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.ZonedDateTime

class ArticleDetailViewModel(private val repo: Repository, val id: Long) : ViewModel() {
    var article by mutableStateOf<ArticleDto?>(null)
    var busy by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)
    var message by mutableStateOf<String?>(null)
    var deleted by mutableStateOf(false)

    init {
        viewModelScope.launch { article = repo.cachedArticle(id); load() }
    }

    fun load() = viewModelScope.launch {
        repo.article(id).onSuccess { article = it; error = null }.onFailure { error = it.message }
    }

    private fun run(block: suspend () -> Result<ActionResultDto>) {
        busy = true; message = null; error = null
        viewModelScope.launch {
            block().onSuccess { r -> message = r.message; r.article?.let { article = it } ?: load(); if (!r.ok) error = r.message }
                .onFailure { error = it.message }
            busy = false
        }
    }

    fun approve() = run { repo.approve(id) }
    fun publishNow() = run { repo.publishNow(id) }
    fun regenerate() = run { repo.regenerate(id) }
    fun schedule(iso: String) = run { repo.schedule(id, iso) }
    fun resolve(published: Boolean, url: String?) = run { repo.resolve(id, published, url) }

    fun save(title: String, content: String, hashtags: List<String>, done: () -> Unit) {
        busy = true
        viewModelScope.launch {
            repo.updateArticle(id, title, content, hashtags)
                .onSuccess { article = it; message = "Article enregistré."; done() }
                .onFailure { error = it.message }
            busy = false
        }
    }

    fun delete() {
        busy = true
        viewModelScope.launch {
            repo.deleteArticle(id).onSuccess { deleted = true }.onFailure { error = it.message }
            busy = false
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ArticleDetailScreen(vm: ArticleDetailViewModel, onBack: () -> Unit) {
    val ctx = LocalContext.current
    val a = vm.article
    var editing by remember { mutableStateOf(false) }
    var confirm by remember { mutableStateOf<String?>(null) }
    var scheduling by remember { mutableStateOf(false) }
    var resolving by remember { mutableStateOf(false) }

    LaunchedEffect(vm.deleted) { if (vm.deleted) onBack() }

    Scaffold(
        containerColor = Cp.Black,
        topBar = {
            TopAppBar(
                title = { Text(if (editing) "Modifier l'article" else "Article") },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Retour") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Cp.Black),
            )
        },
    ) { pad ->
        Column(Modifier.padding(pad).fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            if (vm.busy) LinearProgressIndicator(Modifier.fillMaxWidth(), color = Cp.Turquoise)
            vm.error?.let { ErrorBanner(it) }
            vm.message?.takeIf { vm.error == null }?.let { Panel(accent = Cp.Green) { Text(it, color = Cp.White) } }
            if (a == null) { LoadingBox(); return@Column }

            if (editing) {
                ArticleEditor(a, vm.busy, onCancel = { editing = false }) { t, c, h -> vm.save(t, c, h) { editing = false } }
                return@Column
            }

            Row { StatusChip(articleStatusLabel(a.status), levelColor(a.status)) }
            Text(a.category?.name ?: "", style = MaterialTheme.typography.labelSmall, color = Cp.Turquoise)
            Text(a.title, style = MaterialTheme.typography.titleLarge, color = Cp.White)
            Panel {
                KeyValue("Généré le", Formatters.short(a.generatedAt))
                KeyValue("Publication prévue", Formatters.short(a.scheduledFor))
                a.publishedAt?.let { KeyValue("Publié le", Formatters.short(it), Cp.Green) }
                KeyValue("Longueur", "${a.wordCount} mots")
                KeyValue("Langue", if (a.language == "en") "Anglais" else "Français")
                a.linkedinPostUrn?.let { KeyValue("Identifiant LinkedIn", it) }
            }
            a.error?.let { Panel(accent = Cp.Red) { SectionLabel("Erreur"); Spacer(Modifier.height(4.dp)); Text(it, color = Cp.White) } }
            if (a.quality.issues.isNotEmpty()) {
                Panel(accent = Cp.Orange) {
                    SectionLabel("Contrôle qualité : points à vérifier")
                    a.quality.issues.forEach { Text("• $it", color = Cp.White, style = MaterialTheme.typography.bodyMedium) }
                }
            }
            Panel {
                SectionLabel("Contenu de la publication")
                Spacer(Modifier.height(8.dp))
                SelectionContainer { Text(a.content, color = Cp.White, style = MaterialTheme.typography.bodyLarge) }
                Spacer(Modifier.height(12.dp))
                Text(a.hashtags.joinToString(" ") { "#$it" }, color = Cp.Electric)
            }
            if (a.sources.isNotEmpty()) {
                Panel {
                    SectionLabel("Sources")
                    a.sources.forEach { s ->
                        TextButton(onClick = { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(s.url))) }) {
                            Text(s.title + (s.date?.let { " ($it)" } ?: ""), color = Cp.Turquoise)
                        }
                    }
                }
            }

            // ------------------------------------------------------------------ actions
            val editable = a.status !in setOf("published", "publishing", "generating")
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (a.status == "needs_review") Button(onClick = { vm.approve() }, enabled = !vm.busy) { Text("Valider") }
                if (a.status in setOf("needs_review", "approved", "failed", "retry_scheduled"))
                    Button(onClick = { confirm = "publish" }, enabled = !vm.busy,
                        colors = ButtonDefaults.buttonColors(containerColor = Cp.Electric, contentColor = Cp.White)) { Text("Publier maintenant") }
                if (editable) OutlinedButton(onClick = { editing = true }, enabled = !vm.busy) { Text("Modifier") }
                if (editable && a.status != "uncertain") OutlinedButton(onClick = { scheduling = true }, enabled = !vm.busy) { Text("Programmer") }
                if (editable && a.status != "uncertain") OutlinedButton(onClick = { confirm = "regenerate" }, enabled = !vm.busy) { Text("Régénérer") }
                OutlinedButton(onClick = { copy(ctx, a) }) { Text("Copier") }
                a.linkedinPostUrl?.let { url -> OutlinedButton(onClick = { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }) { Text("Voir sur LinkedIn") } }
                if (a.status == "uncertain") Button(onClick = { resolving = true }) { Text("Résoudre la vérification") }
                if (a.status != "publishing") TextButton(onClick = { confirm = "delete" }, enabled = !vm.busy) { Text("Supprimer", color = Cp.Red) }
            }
        }
    }

    confirm?.let { what ->
        val (title, text) = when (what) {
            "publish" -> "Publier maintenant ?" to "L'article sera publié immédiatement sur votre profil LinkedIn."
            "regenerate" -> "Régénérer l'article ?" to "Le contenu actuel sera remplacé par une nouvelle version."
            else -> "Supprimer l'article ?" to "Cette action est définitive. Une publication déjà faite sur LinkedIn n'est pas supprimée."
        }
        AlertDialog(
            onDismissRequest = { confirm = null },
            title = { Text(title) }, text = { Text(text) },
            confirmButton = { TextButton(onClick = {
                confirm = null
                when (what) { "publish" -> vm.publishNow(); "regenerate" -> vm.regenerate(); else -> vm.delete() }
            }) { Text("Confirmer") } },
            dismissButton = { TextButton(onClick = { confirm = null }) { Text("Annuler") } },
        )
    }
    if (scheduling) ScheduleDialog(onDismiss = { scheduling = false }) { iso -> scheduling = false; vm.schedule(iso) }
    if (resolving) ResolveDialog(onDismiss = { resolving = false }) { pub, url -> resolving = false; vm.resolve(pub, url) }
}

private fun copy(ctx: Context, a: ArticleDto) {
    val text = a.content + "\n\n" + a.hashtags.joinToString(" ") { "#$it" }
    (ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager).setPrimaryClip(ClipData.newPlainText(a.title, text))
    Toast.makeText(ctx, "Contenu copié", Toast.LENGTH_SHORT).show()
}

@Composable
private fun ArticleEditor(a: ArticleDto, busy: Boolean, onCancel: () -> Unit, onSave: (String, String, List<String>) -> Unit) {
    var title by remember { mutableStateOf(a.title) }
    var content by remember { mutableStateOf(a.content) }
    var tags by remember { mutableStateOf(a.hashtags.joinToString(" ")) }
    OutlinedTextField(title, { title = it }, label = { Text("Titre (usage interne)") }, modifier = Modifier.fillMaxWidth())
    OutlinedTextField(content, { content = it }, label = { Text("Texte de la publication") }, modifier = Modifier.fillMaxWidth().heightIn(min = 320.dp))
    OutlinedTextField(tags, { tags = it }, label = { Text("Hashtags (séparés par des espaces, sans #)") }, modifier = Modifier.fillMaxWidth())
    Text("${content.length} caractères", color = Cp.Muted, style = MaterialTheme.typography.bodySmall)
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Button(onClick = {
            onSave(title.trim(), content.trim(), tags.split(Regex("[\\s,]+")).map { it.trim().removePrefix("#") }.filter { it.isNotEmpty() })
        }, enabled = !busy && title.isNotBlank() && content.length >= 100) { Text("Enregistrer") }
        OutlinedButton(onClick = onCancel) { Text("Annuler") }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ScheduleDialog(onDismiss: () -> Unit, onConfirm: (String) -> Unit) {
    val zone = ZoneId.of("Africa/Abidjan")
    val tomorrow = LocalDate.now(zone).plusDays(1)
    var date by remember { mutableStateOf(tomorrow.toString()) }
    var time by remember { mutableStateOf("06:30") }
    var err by remember { mutableStateOf<String?>(null) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Programmer la publication") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Heure d'Abidjan (GMT).", color = Cp.Muted)
                OutlinedTextField(date, { date = it }, label = { Text("Date (AAAA-MM-JJ)") }, singleLine = true)
                OutlinedTextField(time, { time = it }, label = { Text("Heure (HH:MM)") }, singleLine = true)
                err?.let { Text(it, color = Cp.Red) }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                val dt = runCatching { ZonedDateTime.of(LocalDate.parse(date.trim()), LocalTime.parse(time.trim()), zone) }.getOrNull()
                when {
                    dt == null -> err = "Date ou heure invalide."
                    dt.isBefore(ZonedDateTime.now(zone)) -> err = "La date doit être dans le futur."
                    else -> onConfirm(dt.toOffsetDateTime().toString())
                }
            }) { Text("Programmer") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Annuler") } },
    )
}

@Composable
private fun ResolveDialog(onDismiss: () -> Unit, onConfirm: (Boolean, String?) -> Unit) {
    var url by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Vérification de la publication") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("LinkedIn n'a pas renvoyé de réponse certaine. Vérifiez votre profil LinkedIn, puis indiquez ce que vous constatez. " +
                    "CyberPost AI ne republie jamais automatiquement dans ce cas, pour éviter un doublon.", color = Cp.Muted)
                OutlinedTextField(url, { url = it }, label = { Text("Lien du post (facultatif)") }, singleLine = true)
            }
        },
        confirmButton = { TextButton(onClick = { onConfirm(true, url.trim().ifBlank { null }) }) { Text("Le post est en ligne") } },
        dismissButton = { TextButton(onClick = { onConfirm(false, null) }) { Text("Il n'est pas en ligne") } },
    )
}
