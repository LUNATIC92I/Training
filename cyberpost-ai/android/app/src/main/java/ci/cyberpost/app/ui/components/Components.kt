package ci.cyberpost.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import ci.cyberpost.app.ui.theme.Cp
import ci.cyberpost.app.ui.theme.Mono

/** Couleur associée à un niveau d'état renvoyé par le backend. */
fun levelColor(level: String?): Color = when (level) {
    "green", "success", "ok", "published", "connected", "approved" -> Cp.Green
    "orange", "warning", "pending", "needs_review", "uncertain", "expiring", "generating", "retry_scheduled", "scheduled" -> Cp.Orange
    "red", "error", "failed", "generation_failed", "expired", "not_connected", "not_configured" -> Cp.Red
    else -> Cp.Muted
}

/** Libellé français d'un statut d'article. */
fun articleStatusLabel(status: String): String = when (status) {
    "generating" -> "Génération en cours"
    "generation_failed" -> "Échec de génération"
    "needs_review" -> "En attente de validation"
    "approved" -> "Validé, programmé"
    "publishing" -> "Publication en cours"
    "retry_scheduled" -> "Nouvelle tentative prévue"
    "published" -> "Publié"
    "failed" -> "Échec de publication"
    "uncertain" -> "Vérification nécessaire"
    else -> status
}

/** Pastille lumineuse pulsée (statut). */
@Composable
fun StatusDot(color: Color, size: Int = 10, pulse: Boolean = true) {
    val t = rememberInfiniteTransition(label = "pulse")
    val a by t.animateFloat(1f, if (pulse) 0.35f else 1f, infiniteRepeatable(tween(1200), RepeatMode.Reverse), label = "a")
    Box(Modifier.size((size + 8).dp), contentAlignment = Alignment.Center) {
        Box(Modifier.size((size + 8).dp).alpha(a * 0.35f).clip(CircleShape).background(color))
        Box(Modifier.size(size.dp).clip(CircleShape).background(color))
    }
}

/** Panneau à bordure fine, style console SOC. */
@Composable
fun Panel(modifier: Modifier = Modifier, accent: Color? = null, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Brush.verticalGradient(listOf(Cp.Panel, Cp.Night)))
            .border(1.dp, accent?.copy(alpha = 0.55f) ?: Cp.Line, RoundedCornerShape(16.dp))
            .padding(16.dp),
        content = content,
    )
}

@Composable
fun SectionLabel(text: String, modifier: Modifier = Modifier) {
    Text(text.uppercase(), style = MaterialTheme.typography.labelSmall, color = Cp.Turquoise, modifier = modifier)
}

@Composable
fun KeyValue(label: String, value: String, valueColor: Color = Cp.White) {
    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = Cp.Muted, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f))
        Spacer(Modifier.width(12.dp))
        Text(value, color = valueColor, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold,
            maxLines = 2, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
fun StatusChip(text: String, color: Color) {
    Row(
        Modifier.clip(RoundedCornerShape(50)).background(color.copy(alpha = 0.12f))
            .border(1.dp, color.copy(alpha = 0.5f), RoundedCornerShape(50)).padding(horizontal = 10.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(6.dp).clip(CircleShape).background(color))
        Spacer(Modifier.width(6.dp))
        Text(text, color = color, style = MaterialTheme.typography.labelMedium, fontFamily = Mono)
    }
}

@Composable
fun MetricTile(label: String, value: String, modifier: Modifier = Modifier, color: Color = Cp.White) {
    Column(
        modifier.clip(RoundedCornerShape(14.dp)).background(Cp.Panel).border(1.dp, Cp.Line, RoundedCornerShape(14.dp)).padding(14.dp)
    ) {
        Text(value, style = MaterialTheme.typography.headlineSmall, color = color, fontFamily = Mono)
        Spacer(Modifier.height(4.dp))
        Text(label, style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
    }
}

@Composable
fun ErrorBanner(message: String, onRetry: (() -> Unit)? = null) {
    Panel(accent = Cp.Red) {
        Text(message, color = Cp.White, style = MaterialTheme.typography.bodyMedium)
        if (onRetry != null) {
            Spacer(Modifier.height(8.dp))
            OutlinedButton(onClick = onRetry) { Text("Réessayer") }
        }
    }
}

@Composable
fun LoadingBox() {
    Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(color = Cp.Turquoise, strokeWidth = 2.dp)
    }
}

@Composable
fun ScreenHeader(title: String, subtitle: String? = null, actions: @Composable RowScope.() -> Unit = {}) {
    Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.headlineSmall, color = Cp.White)
            if (subtitle != null) Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Cp.Muted)
        }
        actions()
    }
}
