package ci.cyberpost.app.ui.screens

import android.os.Build
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ci.cyberpost.app.BuildConfig
import ci.cyberpost.app.data.Repository
import ci.cyberpost.app.data.ServerUrl
import ci.cyberpost.app.data.SessionStore
import ci.cyberpost.app.ui.components.ErrorBanner
import ci.cyberpost.app.ui.components.Panel
import ci.cyberpost.app.ui.components.SectionLabel
import ci.cyberpost.app.ui.theme.Cp
import kotlinx.coroutines.launch

class LoginViewModel(private val repo: Repository, session: SessionStore) : ViewModel() {
    var server by mutableStateOf(session.serverUrl?.removeSuffix("/api/v1/") ?: "")
    var email by mutableStateOf("")
    var password by mutableStateOf("")
    var loading by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)

    fun submit(onSuccess: () -> Unit) {
        error = null
        val base = when (val r = ServerUrl.normalize(server, BuildConfig.DEBUG)) {
            is ServerUrl.Result.Invalid -> { error = r.reason; return }
            is ServerUrl.Result.Valid -> r.baseUrl
        }
        if (email.isBlank() || password.isBlank()) { error = "Saisissez votre e-mail et votre mot de passe."; return }
        loading = true
        viewModelScope.launch {
            repo.login(base, email, password, "${Build.MANUFACTURER} ${Build.MODEL}")
                .onSuccess { password = ""; onSuccess() }
                .onFailure { error = it.message }
            loading = false
        }
    }
}

@Composable
fun LoginScreen(vm: LoginViewModel, onLoggedIn: () -> Unit) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp).systemBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Spacer(Modifier.height(24.dp))
        SectionLabel("Console de publication")
        Text("CyberPost AI", style = MaterialTheme.typography.displaySmall, color = Cp.White)
        Text(
            "Assistant de publication professionnelle sur LinkedIn spécialisé en cybersécurité.",
            style = MaterialTheme.typography.bodyLarge, color = Cp.Muted,
        )
        Panel {
            SectionLabel("Connexion au serveur")
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(vm.server, { vm.server = it }, label = { Text("Adresse du serveur") },
                placeholder = { Text("https://cyberpost.example.com") }, singleLine = true, modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri))
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(vm.email, { vm.email = it }, label = { Text("E-mail") }, singleLine = true, modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email))
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(vm.password, { vm.password = it }, label = { Text("Mot de passe") }, singleLine = true,
                visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password))
            Spacer(Modifier.height(16.dp))
            Button(onClick = { vm.submit(onLoggedIn) }, enabled = !vm.loading, modifier = Modifier.fillMaxWidth().height(50.dp)) {
                if (vm.loading) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp, color = Cp.Black)
                else Text("Se connecter")
            }
        }
        vm.error?.let { ErrorBanner(it) }
        Text(
            "Le compte est créé sur votre serveur (commande php artisan cyberpost:user:create). " +
                "Les clés d'API et les jetons LinkedIn restent exclusivement sur le serveur.",
            style = MaterialTheme.typography.bodySmall, color = Cp.Muted,
        )
    }
}
