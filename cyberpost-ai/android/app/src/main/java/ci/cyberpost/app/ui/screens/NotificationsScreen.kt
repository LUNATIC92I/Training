package ci.cyberpost.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.ui.Formatters
import ci.cyberpost.app.ui.components.*
import ci.cyberpost.app.ui.theme.Cp
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class NotificationsViewModel(private val repo: Repository) : ViewModel() {
    val items = repo.notifications.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    var loading by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)

    init { refresh() }

    fun refresh() {
        loading = true
        viewModelScope.launch {
            repo.syncNotifications().onSuccess { error = null }.onFailure { error = it.message }
            loading = false
        }
    }

    fun markAll() = viewModelScope.launch { repo.markAllRead().onFailure { error = it.message } }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(vm: NotificationsViewModel, onOpenArticle: (Long) -> Unit) {
    val list by vm.items.collectAsState()
    PullToRefreshBox(isRefreshing = vm.loading, onRefresh = vm::refresh, modifier = Modifier.fillMaxSize()) {
        LazyColumn(contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            item {
                ScreenHeader("Alertes", "${list.count { it.readAt == null }} non lue(s)") {
                    TextButton(onClick = vm::markAll) { Text("Tout marquer lu") }
                }
            }
            vm.error?.let { item { ErrorBanner(it, vm::refresh) } }
            if (list.isEmpty() && !vm.loading) item { Panel { Text("Aucune notification pour le moment.", color = Cp.Muted) } }
            items(list, key = { it.id }) { n ->
                Panel(Modifier.let { m -> n.articleId?.let { id -> m.clickable { onOpenArticle(id) } } ?: m },
                    accent = if (n.readAt == null) levelColor(n.level) else null) {
                    Row(verticalAlignment = Alignment.Top) {
                        StatusDot(levelColor(n.level), 8, pulse = n.readAt == null)
                        Spacer(Modifier.width(10.dp))
                        Column {
                            Text(n.title, style = MaterialTheme.typography.titleSmall, color = Cp.White)
                            Text(n.body, style = MaterialTheme.typography.bodyMedium, color = Cp.Muted)
                            Text(Formatters.short(n.createdAt), style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
                        }
                    }
                }
            }
        }
    }
}
