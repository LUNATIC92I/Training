package ci.cyberpost.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.remote.ArticleDto
import ci.cyberpost.app.data.remote.CategoryDto
import ci.cyberpost.app.ui.Formatters
import ci.cyberpost.app.ui.components.*
import ci.cyberpost.app.ui.theme.Cp
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ArticlesViewModel(private val repo: Repository) : ViewModel() {
    val filter = MutableStateFlow<String?>(null)
    val articles = combine(repo.articles, filter) { list, f -> if (f == null) list else list.filter { it.status == f } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    var loading by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)
    var info by mutableStateOf<String?>(null)
    var categories by mutableStateOf<List<CategoryDto>>(emptyList())

    init { refresh() }

    fun refresh() {
        loading = true
        viewModelScope.launch {
            repo.refreshArticles().onSuccess { error = null }.onFailure { error = it.message }
            if (categories.isEmpty()) repo.categories().onSuccess { categories = it.filter { c -> c.enabled } }
            loading = false
        }
    }

    fun generate(category: String?) {
        loading = true
        viewModelScope.launch {
            repo.generate(category).onSuccess { info = it.message; repo.refreshArticles() }.onFailure { error = it.message }
            loading = false
        }
    }
}

private val filters = listOf(null to "Tous", "needs_review" to "À valider", "approved" to "Programmés",
    "published" to "Publiés", "failed" to "Échecs", "uncertain" to "À vérifier")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ArticlesScreen(vm: ArticlesViewModel, onOpen: (Long) -> Unit) {
    val list by vm.articles.collectAsState()
    val current by vm.filter.collectAsState()
    var showGenerate by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = Cp.Black,
        floatingActionButton = {
            ExtendedFloatingActionButton(onClick = { showGenerate = true }, containerColor = Cp.Turquoise, contentColor = Cp.Black,
                icon = { Icon(Icons.Default.Add, null) }, text = { Text("Générer un article") })
        },
    ) { pad ->
        PullToRefreshBox(isRefreshing = vm.loading, onRefresh = vm::refresh, modifier = Modifier.padding(pad).fillMaxSize()) {
            LazyColumn(contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 96.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item { ScreenHeader("Articles", "${list.size} article(s)") }
                item {
                    Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        filters.forEach { (key, label) ->
                            FilterChip(selected = current == key, onClick = { vm.filter.value = key }, label = { Text(label) })
                        }
                    }
                }
                vm.error?.let { item { ErrorBanner(it, vm::refresh) } }
                vm.info?.let { item { Panel(accent = Cp.Turquoise) { Text(it, color = Cp.White) } } }
                if (list.isEmpty() && !vm.loading) item {
                    Panel { Text("Aucun article pour ce filtre. Les articles sont générés automatiquement avant chaque publication, ou à la demande.", color = Cp.Muted) }
                }
                items(list, key = { it.id }) { ArticleCard(it) { onOpen(it.id) } }
            }
        }
    }

    if (showGenerate) {
        AlertDialog(
            onDismissRequest = { showGenerate = false },
            title = { Text("Générer un article") },
            text = {
                Column(Modifier.heightIn(max = 400.dp)) {
                    Text("Choisissez une catégorie, ou laissez le calendrier éditorial choisir.", color = Cp.Muted)
                    Spacer(Modifier.height(8.dp))
                    LazyColumn {
                        item { TextButton(onClick = { showGenerate = false; vm.generate(null) }) { Text("Selon le calendrier du jour") } }
                        items(vm.categories) { c -> TextButton(onClick = { showGenerate = false; vm.generate(c.slug) }) { Text(c.name) } }
                    }
                }
            },
            confirmButton = {},
            dismissButton = { TextButton(onClick = { showGenerate = false }) { Text("Annuler") } },
        )
    }
}

@Composable
fun ArticleCard(a: ArticleDto, onClick: () -> Unit) {
    Panel(Modifier.clickable(onClick = onClick)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(a.category?.name ?: "", style = MaterialTheme.typography.labelSmall, color = Cp.Turquoise, modifier = Modifier.weight(1f))
            StatusChip(articleStatusLabel(a.status), levelColor(a.status))
        }
        Spacer(Modifier.height(8.dp))
        Text(a.title, style = MaterialTheme.typography.titleMedium, color = Cp.White, maxLines = 2, overflow = TextOverflow.Ellipsis)
        a.preview?.let { Text(it, style = MaterialTheme.typography.bodySmall, color = Cp.Muted, maxLines = 2, overflow = TextOverflow.Ellipsis) }
        Spacer(Modifier.height(6.dp))
        val date = a.publishedAt?.let { "Publié le ${Formatters.short(it)}" }
            ?: a.scheduledFor?.let { "Prévu le ${Formatters.short(it)}" }
            ?: a.generatedAt?.let { "Généré le ${Formatters.short(it)}" } ?: ""
        Text(date, style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
    }
}
