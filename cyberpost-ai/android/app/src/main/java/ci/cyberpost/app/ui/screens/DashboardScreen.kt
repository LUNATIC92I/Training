package ci.cyberpost.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.remote.DashboardDto
import ci.cyberpost.app.ui.Formatters
import ci.cyberpost.app.ui.components.*
import ci.cyberpost.app.ui.theme.Cp
import ci.cyberpost.app.ui.theme.Mono
import kotlinx.coroutines.launch

class DashboardViewModel(private val repo: Repository) : ViewModel() {
    var data by mutableStateOf<DashboardDto?>(null)
    var loading by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)
    var fromCache by mutableStateOf(false)

    init { load() }

    fun load() {
        loading = true
        viewModelScope.launch {
            if (data == null) repo.cachedDashboard()?.let { data = it; fromCache = true }
            repo.dashboard()
                .onSuccess { data = it; error = null; fromCache = false }
                .onFailure { error = it.message }
            loading = false
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(vm: DashboardViewModel, onOpenArticle: (Long) -> Unit, onOpenSettings: () -> Unit) {
    PullToRefreshBox(isRefreshing = vm.loading, onRefresh = vm::load, modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item(key = "header") {
                ScreenHeader("Tableau de bord", "Centre de contrôle des publications") {
                    IconButton(onClick = vm::load) { Icon(Icons.Default.Refresh, contentDescription = "Actualiser") }
                }
            }
            vm.error?.let { msg -> item(key = "error") { ErrorBanner(if (vm.fromCache) "$msg Données affichées depuis le cache." else msg, vm::load) } }
            val d = vm.data
            if (d == null) {
                if (vm.loading) item(key = "loading") { LoadingBox() }
                return@LazyColumn
            }
            item(key = "status") {
                val c = levelColor(d.status.level)
                Panel(accent = c) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        StatusDot(c)
                        Spacer(Modifier.width(10.dp))
                        Column {
                            Text(
                                when (d.status.level) { "green" -> "Système opérationnel"; "orange" -> "Intervention ou attente"; else -> "Problème détecté" },
                                style = MaterialTheme.typography.titleMedium, color = c,
                            )
                            Text(d.status.message, style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
                        }
                    }
                }
            }
            item(key = "next") {
                Panel {
                    SectionLabel("Prochaine publication")
                    Spacer(Modifier.height(8.dp))
                    val n = d.nextPublication
                    if (n == null) {
                        Text("Aucune publication programmée (vérifiez les jours de publication).", color = Cp.Muted)
                    } else {
                        Text(Formatters.full(n.at, n.timezone), style = MaterialTheme.typography.titleMedium, color = Cp.White)
                        Text("Fuseau : ${n.timezone}", style = MaterialTheme.typography.bodySmall, color = Cp.Muted, fontFamily = Mono)
                        Spacer(Modifier.height(8.dp))
                        if (n.articleId != null) {
                            Row(Modifier.fillMaxWidth().clickable { onOpenArticle(n.articleId) }, verticalAlignment = Alignment.CenterVertically) {
                                Text(n.articleTitle ?: "Article #${n.articleId}", Modifier.weight(1f), color = Cp.White)
                                StatusChip(articleStatusLabel(n.articleStatus ?: ""), levelColor(n.articleStatus))
                            }
                        } else {
                            Text("L'article sera généré avant l'heure de publication.", color = Cp.Muted, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                    KeyValue("Heure de publication", d.schedule.time)
                    KeyValue("Jours", d.schedule.days.sorted().joinToString(", ") { day -> Formatters.weekdays.first { it.first == day }.second.take(3) })
                    KeyValue("Mode", if (d.schedule.mode == "automatic") "Automatique" else "Validation")
                }
            }
            item(key = "metrics1") {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    MetricTile("Articles publiés", d.stats.totalPublished.toString(), Modifier.weight(1f), Cp.Turquoise)
                    MetricTile("Cette semaine", "${d.stats.publishedThisWeek}/${d.schedule.days.size}", Modifier.weight(1f))
                }
            }
            item(key = "metrics2") {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    MetricTile("En attente de validation", d.stats.pendingReview.toString(), Modifier.weight(1f),
                        if (d.stats.pendingReview > 0) Cp.Orange else Cp.White)
                    MetricTile("Échecs", d.stats.failedTotal.toString(), Modifier.weight(1f), if (d.stats.failedTotal > 0) Cp.Red else Cp.White)
                }
            }
            item(key = "components") {
                Panel {
                    SectionLabel("Composants")
                    Spacer(Modifier.height(8.dp))
                    ComponentRow("LinkedIn", d.linkedin.status, d.linkedin.message ?: (d.linkedin.name ?: ""), onOpenSettings)
                    ComponentRow("Moteur de génération", d.generator.status, d.generator.message, onOpenSettings)
                    ComponentRow("Planificateur", d.scheduler.status, d.scheduler.message, null)
                    ComponentRow("Notifications push", d.push.status, d.push.message, null)
                }
            }
            d.lastPublication?.let { lp ->
                item(key = "last-publication") {
                    Panel(Modifier.clickable { onOpenArticle(lp.articleId) }) {
                        SectionLabel("Dernière publication")
                        Spacer(Modifier.height(8.dp))
                        Text(lp.title, style = MaterialTheme.typography.titleMedium, color = Cp.White)
                        Text(Formatters.full(lp.publishedAt), style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
                    }
                }
            }
            item(key = "errors") {
                Panel {
                    SectionLabel("Historique des erreurs")
                    Spacer(Modifier.height(8.dp))
                    if (d.recentErrors.isEmpty()) Text("Aucune erreur récente.", color = Cp.Muted)
                    d.recentErrors.forEach { e ->
                        Row(Modifier.fillMaxWidth().padding(vertical = 6.dp).let { m -> e.articleId?.let { id -> m.clickable { onOpenArticle(id) } } ?: m }) {
                            StatusDot(levelColor(e.level), 6, pulse = false)
                            Spacer(Modifier.width(8.dp))
                            Column {
                                Text(e.message, style = MaterialTheme.typography.bodyMedium, color = Cp.White)
                                Text(Formatters.short(e.at), style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ComponentRow(name: String, status: String, message: String, onClick: (() -> Unit)?) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 6.dp).let { if (onClick != null) it.clickable(onClick = onClick) else it },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        StatusDot(levelColor(status), 8, pulse = status != "ok" && status != "connected")
        Spacer(Modifier.width(10.dp))
        Column(Modifier.weight(1f)) {
            Text(name, style = MaterialTheme.typography.bodyMedium, color = Cp.White)
            if (message.isNotBlank()) Text(message, style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
        }
    }
}
