package se.emilkronholm.terrax9.ui.screens.controller

import android.annotation.SuppressLint
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import se.emilkronholm.terrax9.R
import se.emilkronholm.terrax9.ui.screens.test.Commands
import se.emilkronholm.terrax9.ui.theme.AppColors

@Composable
fun UpperDashboard() {
    val viewModel: ViewModel = ViewModel("rover-001")
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center
    ) {
        Row(
            modifier = Modifier
                .fillMaxHeight(0.6f)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            //Left side
            Column(
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.weight(1f)
            ) {
                Text("Off")
                IconButton(
                    text = "Lights",
                    iconRes = R.drawable.settings
                ) { }
            }

            // Video
            VideoStream(
                modifier = Modifier
                    .weight(3f)
                    .aspectRatio(ratio = 16f / 9f)
                    .border(
                        3.dp, color = Color.White, shape = RoundedCornerShape(size = 12.dp)
                    )
                    .clip(RoundedCornerShape(24.dp))

            )

            // Buttons
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                IconButton(
                    text = "Gallery",
                    iconRes = R.drawable.images
                ) { }

                IconButton(
                    text = "Settings",
                    iconRes = R.drawable.settings
                ) { }
            }
        }

        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Bottom
        ) {
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                JoyStick(onMove = { x, y ->
                    viewModel.onMovement(x, y)
                })
                IconButton(text = "Take photo", iconRes = R.drawable.camera) { }
                JoyStick()
                JoyStick()
            }
        }
    }

}

@Composable
fun JoySticks() {
    // 4 Items (JS, btn, JS, JS)
}

@Composable
fun ControllerScreen() {
    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(R.drawable.backgroundpicture),
            contentDescription = null,
            contentScale = ContentScale.Crop,
        )
        UpperDashboard()
    }
}

// This screen is the entry point for the controller dashboard.
@Composable
fun ControllerScreen1() {
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
            VideoStream(
                modifier = Modifier
                    .fillMaxHeight(0.5f)
                    .aspectRatio(ratio = 16f / 9f)
            )
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
    Box(
        modifier = modifier
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
        })
    }
}