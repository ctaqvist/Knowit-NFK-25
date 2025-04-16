package se.emilkronholm.terrax9.ui.screens.controller

import android.annotation.SuppressLint
import android.graphics.drawable.Icon
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.annotation.DrawableRes
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.MailOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SegmentedButtonDefaults.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import se.emilkronholm.terrax9.R
import se.emilkronholm.terrax9.ui.screens.controller.ViewModel
import se.emilkronholm.terrax9.ui.theme.AppColors
import kotlin.math.*

@Composable
fun ControllerScreen() {
    val viewModel: ViewModel = ViewModel()
    Column(
        modifier = Modifier.padding(bottom = 15.dp, start = 80.dp, end = 80.dp)
    ) {
        // Upper half
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.Center
        ) {
            VideoStream(modifier = Modifier.fillMaxHeight(0.6f).aspectRatio(ratio = 16f/9f),)
        }

        Text("hej")
        // Lower half
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.End
        ) {
            JoyCon() { x, y ->
                println("Moving")
                viewModel.onMovement(x, y)
            }
            Spacer(modifier = Modifier.width(50.dp))
            Column {
                IconButton(
                    icon = Icons.Filled.Face,
                    onClick = {
                        viewModel.sendCommand(command = Command.PIC)
                    }
                )

                IconButton(
                    icon = Icons.Filled.KeyboardArrowUp,
                    onClick = {
                        viewModel.sendCommand(command = Command.HEADLIGHT_ON)
                    }
                )

                IconButton(
                    icon = Icons.Filled.KeyboardArrowDown,
                    onClick = {
                        viewModel.sendCommand(command = Command.HEADLIGHT_OFF)
                    }
                )
            }

            Column {
                IconButton(
                    icon = Icons.Filled.Call,
                    onClick = {
                        viewModel.sendCommand(command = Command.START_STREAM)
                    }
                )

                IconButton(
                    icon = Icons.Filled.Close,
                    onClick = {
                        viewModel.sendCommand(command = Command.STOP_STREAM)
                    }
                )
            }
            Spacer(modifier = Modifier.width(50.dp))
            JoyCon(isFixed = true)
            JoyCon(isFixed = true)
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