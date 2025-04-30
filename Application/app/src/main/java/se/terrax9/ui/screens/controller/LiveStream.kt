package se.terrax9.ui.screens.controller

import android.annotation.SuppressLint
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

// The livestream is dependent on working js, therefore it must be enabled.
// Finally, there are no user data inputs in the WebView and therefore low risk of XSS
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun VideoStream(
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