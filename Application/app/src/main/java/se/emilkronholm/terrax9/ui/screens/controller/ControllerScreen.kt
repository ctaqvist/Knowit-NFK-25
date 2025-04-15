package se.emilkronholm.terrax9.ui.screens.controller

import android.annotation.SuppressLint
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import se.emilkronholm.terrax9.ui.screens.test.VideoStream
import se.emilkronholm.terrax9.ui.screens.controller.ViewModel
import se.emilkronholm.terrax9.ui.theme.AppColors
import kotlin.math.*

@Composable
fun ControllerScreen() {
    val viewModel: ViewModel = ViewModel()

    Column() {

        // Upper half
        Row(
            modifier = Modifier.fillMaxHeight(0.4f),
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.End
        ) {
//            VideoStream(viewModel = viewModel)
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
            Spacer(modifier = Modifier.width(300.dp))
            JoyCon(isFixed = true)
            JoyCon(isFixed = true)
        }
    }

}

