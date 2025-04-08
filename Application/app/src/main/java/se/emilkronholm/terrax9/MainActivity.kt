package se.emilkronholm.terrax9

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.ViewModel
import se.emilkronholm.terrax9.ui.theme.Terrax9Theme
import androidx.lifecycle.viewmodel.compose.viewModel
import se.emilkronholm.terrax9.ui.theme.AppColors

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Terrax9Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        App()
                    }
                }
            }
        }
    }
}

@Composable
fun App() {
    val appViewModel: AppViewModel = viewModel()

    LaunchedEffect(Unit) {
        appViewModel.connect()
    }

    val message by appViewModel.recentMessage.collectAsState()
    println("recomp")
    if (message != null) {
        val toast = Toast.makeText(LocalContext.current, message, Toast.LENGTH_SHORT)
        toast.show()
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
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
        Button(onClick = {
            println("Take picture")
            appViewModel.sendPictureCommand()
        }) {
            Text(
                "Take picture!",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(8.dp)
            )
        }

        Spacer(modifier = Modifier.size(16.dp))

        Button(onClick = {
            println("Sent ping click")
            appViewModel.sendMessage("Ping")
        }) {
            Text(
                "Send ping",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(8.dp)
            )
        }

        var videoKey by remember { mutableStateOf(0) }
        Button(onClick = {
            videoKey++
        }) {
            Text(
                "Reload video",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(8.dp)
            )
        }
        
        key(videoKey) {
            VideoStream(modifier = Modifier.fillMaxWidth())
        }
    }
}

@Composable
fun VideoStream(modifier: Modifier = Modifier) {
    AndroidView(factory = { context ->
        WebView(context).apply {
            settings.javaScriptEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            webChromeClient = WebChromeClient()
            loadUrl("file:///android_asset/stream_player.html")
        }
    }, modifier = modifier)
}
