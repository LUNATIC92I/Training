package ci.cyberpost.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/* Palette inspirée des consoles SOC : fond noir / bleu nuit, accents turquoise et bleu électrique. */
object Cp {
    val Black = Color(0xFF05080F)
    val Night = Color(0xFF0B1424)
    val Panel = Color(0xFF101C30)
    val PanelHigh = Color(0xFF16263F)
    val Line = Color(0xFF223554)
    val Turquoise = Color(0xFF00D1C1)
    val Electric = Color(0xFF2F7BFF)
    val White = Color(0xFFF2F6FB)
    val Muted = Color(0xFF8C9BB2)
    val Green = Color(0xFF22D39B)
    val Orange = Color(0xFFFFA940)
    val Red = Color(0xFFFF5C6C)
}

private val scheme = darkColorScheme(
    primary = Cp.Turquoise,
    onPrimary = Cp.Black,
    secondary = Cp.Electric,
    onSecondary = Cp.White,
    tertiary = Cp.Green,
    background = Cp.Black,
    onBackground = Cp.White,
    surface = Cp.Night,
    onSurface = Cp.White,
    surfaceVariant = Cp.Panel,
    onSurfaceVariant = Cp.Muted,
    surfaceContainer = Cp.Panel,
    surfaceContainerHigh = Cp.PanelHigh,
    surfaceContainerHighest = Cp.PanelHigh,
    surfaceContainerLow = Cp.Night,
    outline = Cp.Line,
    outlineVariant = Cp.Line,
    error = Cp.Red,
    onError = Cp.Black,
)

val Mono = FontFamily.Monospace

private val typography = Typography().let { t ->
    t.copy(
        headlineSmall = t.headlineSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = (-0.2).sp),
        titleLarge = t.titleLarge.copy(fontWeight = FontWeight.Bold),
        titleMedium = t.titleMedium.copy(fontWeight = FontWeight.SemiBold),
        labelSmall = TextStyle(fontFamily = Mono, fontSize = 11.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.Medium),
    )
}

@Composable
fun CyberPostTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = scheme, typography = typography, content = content)
}
