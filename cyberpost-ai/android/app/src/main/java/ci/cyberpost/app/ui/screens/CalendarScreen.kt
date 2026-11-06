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
import ci.cyberpost.app.data.remote.CalendarDayUpdate
import ci.cyberpost.app.data.remote.CalendarDto
import ci.cyberpost.app.data.remote.CategoryDto
import ci.cyberpost.app.ui.Formatters
import ci.cyberpost.app.ui.components.*
import ci.cyberpost.app.ui.theme.Cp
import kotlinx.coroutines.launch

class CalendarViewModel(private val repo: Repository) : ViewModel() {
    var calendar by mutableStateOf<CalendarDto?>(null)
    var categories by mutableStateOf<List<CategoryDto>>(emptyList())
    var loading by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)

    init { load() }

    fun load() {
        loading = true
        viewModelScope.launch {
            repo.calendar().onSuccess { calendar = it; error = null }.onFailure { error = it.message }
            repo.categories().onSuccess { categories = it }
            loading = false
        }
    }

    fun setDay(weekday: Int, slugs: List<String>) {
        val cal = calendar ?: return
        val days = cal.days.map { CalendarDayUpdate(it.weekday, if (it.weekday == weekday) slugs else it.categories) }
        loading = true
        viewModelScope.launch {
            repo.updateCalendar(days).onSuccess { calendar = it; error = null }.onFailure { error = it.message }
            loading = false
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun CalendarScreen(vm: CalendarViewModel, onOpenArticle: (Long) -> Unit) {
    var editing by remember { mutableStateOf<Int?>(null) }
    val names = vm.categories.associate { it.slug to it.name }
    PullToRefreshBox(isRefreshing = vm.loading, onRefresh = vm::load, modifier = Modifier.fillMaxSize()) {
        LazyColumn(contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            item { ScreenHeader("Calendrier éditorial", vm.calendar?.let { "Publication à ${it.time} (${it.timezone})" }) }
            vm.error?.let { item { ErrorBanner(it, vm::load) } }
            val cal = vm.calendar ?: return@LazyColumn
            item { SectionLabel("Semaine type") }
            items(cal.days.filter { it.weekday <= 7 }, key = { it.weekday }) { d ->
                Panel(Modifier.clickable(enabled = d.enabled) { editing = d.weekday }, accent = if (d.enabled) null else null) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(d.label, style = MaterialTheme.typography.titleMedium, color = if (d.enabled) Cp.White else Cp.Muted, modifier = Modifier.weight(1f))
                        if (!d.enabled) StatusChip("Aucune publication", Cp.Muted) else Text("Modifier", color = Cp.Turquoise, style = MaterialTheme.typography.labelMedium)
                    }
                    if (d.enabled) {
                        Spacer(Modifier.height(6.dp))
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            d.categories.forEach { StatusChip(names[it] ?: it, Cp.Electric) }
                            if (d.categories.isEmpty()) Text("Toutes les catégories actives", color = Cp.Muted)
                        }
                    }
                }
            }
            item { Spacer(Modifier.height(8.dp)); SectionLabel("Prochaines publications") }
            items(cal.upcoming, key = { it.date }) { u ->
                Panel(Modifier.let { m -> u.articleId?.let { id -> m.clickable { onOpenArticle(id) } } ?: m }) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text(Formatters.dayLabel(u.date), style = MaterialTheme.typography.titleSmall, color = Cp.White)
                            Text(u.articleTitle ?: u.categories.joinToString(" · ") { names[it] ?: it }, style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
                        }
                        StatusChip(u.articleStatus?.let { articleStatusLabel(it) } ?: "À générer", levelColor(u.articleStatus ?: "none"))
                    }
                }
            }
        }
    }
    editing?.let { wd ->
        val day = vm.calendar?.days?.firstOrNull { it.weekday == wd } ?: return@let
        var selected by remember(wd) { mutableStateOf(day.categories.toSet()) }
        AlertDialog(
            onDismissRequest = { editing = null },
            title = { Text("Thèmes du ${day.label.lowercase()}") },
            text = {
                LazyColumn(Modifier.heightIn(max = 420.dp)) {
                    items(vm.categories.filter { it.enabled }) { c ->
                        Row(Modifier.fillMaxWidth().clickable { selected = if (c.slug in selected) selected - c.slug else selected + c.slug }, verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(checked = c.slug in selected, onCheckedChange = null)
                            Spacer(Modifier.width(8.dp))
                            Column { Text(c.name); Text(c.group, color = Cp.Muted, style = MaterialTheme.typography.bodySmall) }
                        }
                    }
                }
            },
            confirmButton = { TextButton(onClick = { vm.setDay(wd, selected.toList()); editing = null }) { Text("Enregistrer") } },
            dismissButton = { TextButton(onClick = { editing = null }) { Text("Annuler") } },
        )
    }
}
