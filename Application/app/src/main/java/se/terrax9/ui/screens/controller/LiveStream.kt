package se.terrax9.ui.screens.controller

import android.annotation.SuppressLint
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCompositionContext
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView

// The livestream is dependent on working js, therefore it must be enabled.
// Finally, there are no user data inputs in the WebView and therefore low risk of XSS
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun VideoStream(
    modifier: Modifier = Modifier
) {
    var hej by remember { mutableStateOf(0) }
    println("recomp")
    Box(
        modifier = modifier
            .size(4000.dp)
            .clickable {
                println("click")
                hej++;
            }
    ) {
        println("$hej")
        Text(
            text = "$hej",
            color = Color.Transparent,
            fontSize = 0.sp
        )
        Box(
            modifier = modifier
                .fillMaxSize()
        ) {
            key (hej) {
                AndroidView(
                    factory = { context ->
                        WebView(context).apply {
                            settings.javaScriptEnabled = true
                            webChromeClient = WebChromeClient()
                            loadUrl("file:///android_asset/stream_player.html?key=$hej")
                        }
                    }
                )
            }

            // This layer captures clicks above the WebView
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .pointerInput(Unit) {
                        detectTapGestures {
                            println("click")
                            hej++
                        }
                    }
            )

            // Force recomposition
            Text(
                text = "$hej",
                color = Color.Transparent,
                fontSize = 30.sp
            )
        }

    }
}