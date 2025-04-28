package se.terrax9.ui.screens.controller

import android.annotation.SuppressLint
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import se.terrax9.ui.screens.test.Commands
import se.terrax9.ui.theme.AppColors

// This screen is the entry point for the controller dashboard.
@Composable
fun ControllerScreen() {
    val viewModel: ViewModel = ViewModel("rover-001")
    Column(
        modifier = Modifier.padding(bottom = 15.dp, start = 80.dp, end = 80.dp)
    ) {
        // Upper half
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.Center
        ) {
            VideoStream(modifier = Modifier.fillMaxHeight(0.5f).aspectRatio(ratio = 16f/9f),)
        }

        Text("hej")
        // Lower half
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.End
        ) {
            JoyStick() { x, y ->
                println("Moving")
                viewModel.onMovement(x, y)
            }
            Spacer(modifier = Modifier.width(50.dp))
            Column {
                IconButton(
                    icon = Icons.Filled.Face,
                    onClick = {
                        viewModel.sendCommand(Commands.takePicture())
                    }
                )

                IconButton(
                    icon = Icons.Filled.KeyboardArrowUp,
                    onClick = {
                        viewModel.sendCommand(Commands.startHeadlights())
                    }
                )

                IconButton(
                    icon = Icons.Filled.KeyboardArrowDown,
                    onClick = {
                        viewModel.sendCommand(Commands.closeHeadlights())
                    }
                )
            }

            Column {
                IconButton(
                    icon = Icons.Filled.Call,
                    onClick = {
                        viewModel.sendCommand(Commands.startStream())
                    }
                )

                IconButton(
                    icon = Icons.Filled.Close,
                    onClick = {
                        viewModel.sendCommand(Commands.stopStream())
                    }
                )
            }
            Spacer(modifier = Modifier.width(50.dp))
            JoyStick(isFixed = true)
            JoyStick(isFixed = true)
        }
    }
}

@Composable
fun IconButton(
    icon: ImageVector,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .background(color = AppColors.Primary)
            .size(60.dp)
            .clickable {
                onClick()
            },
        contentAlignment = Alignment.Center
    ) {
        Icon(
            icon,
            contentDescription = null
        )
    }
}

// Since we are semi-sure there is no risk of XSS and we need JS, we will suppress warning
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun VideoStream(
//    viewModel: se.emilkronholm.terrax9.ui.screens.test.ViewModel,
    modifier: Modifier = Modifier
) {
    AndroidView(factory = { context ->
        WebView(context).apply {
            // I have not yet experimented with these settings
            settings.apply {
                javaScriptEnabled = true
                mediaPlaybackRequiresUserGesture = false
                setSupportZoom(true)
                builtInZoomControls = true
                displayZoomControls = false
                loadWithOverviewMode = true
                useWideViewPort = true
            }
            settings.javaScriptEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            webChromeClient = WebChromeClient()
            loadUrl("file:///android_asset/stream_player.html")
        }
    }, modifier = modifier)
}