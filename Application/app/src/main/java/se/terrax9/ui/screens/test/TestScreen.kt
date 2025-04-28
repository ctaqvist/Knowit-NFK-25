package se.terrax9.ui.screens.test

import android.annotation.SuppressLint
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import se.terrax9.ui.theme.AppColors
import com.google.accompanist.*


@Composable
fun TestScreen() {
    val viewModel: ViewModel = ViewModel("test.lazyloops.se")

    // Buttons
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.size(40.dp))
        TestScreenTitle()

        Column(
            horizontalAlignment = Alignment.Start
        ) {
            ButtonGrid(viewModel)
        }
        VideoStream(viewModel)
    }

    ToastParent(viewModel)
}

@Composable
fun ToastParent(viewModel: ViewModel) {
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        viewModel.recentMessage.collect { message ->
            if (message.isNotBlank()) {
                Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
            }
        }
    }
}

@Composable
fun TestScreenTitle() {
    Text(
        "TerraX9",
        style = MaterialTheme.typography.displayMedium,
        color = AppColors.SecondaryLight
    )
    Text(
        "Welcome to TerraX9 app version 1!",
        style = MaterialTheme.typography.headlineSmall,
        modifier = Modifier.padding(36.dp)
    )
}


@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ButtonGrid(viewModel: ViewModel) {
    FlowRow (
        verticalArrangement = Arrangement.Center
    ) {
        Text("General")
        QuickButton(text = "Connect") { viewModel.sendConnect() }
        QuickButton(text = "Disconnect") { viewModel.sendDisconnect() }
        QuickButton(text = "Ping") { viewModel.sendPing() }
        QuickButton(text = "Reload video") { viewModel.sendReloadVideo() }
    }

    FlowRow {
        Text("Commands")
        QuickButton(text = "PIC") { viewModel.sendTakePicture() }
        QuickButton(text = "STREAM") { viewModel.sendStartStream() }
        QuickButton(text = "STOP_STREAM") { viewModel.sendStopStream() }
        QuickButton(text = "TT") { viewModel.sendTankTurn() }
        QuickButton(text = "HeadLights ON") { viewModel.sendStartHeadlights() }
        QuickButton(text = "HeadLights OFF") { viewModel.sendCloseHeadlights() }
    }
}

// Quick button is used to quickly make a button.
// Does not follow best practices for modifier because this button is only used here
@Composable
fun QuickButton(
    text: String,
    @SuppressLint("ModifierParameter") modifier: Modifier = Modifier.padding(4.dp),
    onClick: () -> Unit = {}
) {
    Button(
        onClick = onClick,
        modifier = modifier
    ) {
        Text(
            text,
            style = MaterialTheme.typography.labelMedium,
            modifier = Modifier.padding(3.dp)
        )
    }
}

// Since we are sure that there is no risk of XSS, and we need JS, we will suppress warning
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun VideoStream(viewModel: ViewModel, modifier: Modifier = Modifier) {
    val reloadVideoKey by viewModel.reloadVideoKey.collectAsState()
    key (reloadVideoKey) {
        println("Reloaded :)")
        AndroidView(factory = { context ->
            WebView(context).apply {
                settings.javaScriptEnabled = true
                settings.mediaPlaybackRequiresUserGesture = false
                webChromeClient = WebChromeClient()
                loadUrl("file:///android_asset/stream_player.html")
            }
        }, modifier = modifier)
    }
}