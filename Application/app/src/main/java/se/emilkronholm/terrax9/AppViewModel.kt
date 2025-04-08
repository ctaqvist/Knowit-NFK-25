package se.emilkronholm.terrax9

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.http.HttpMethod
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

val client = HttpClient(CIO) {
    install(WebSockets)
}

class AppViewModel : ViewModel() {
    private var socket: WebSocketSession? = null
    var recentMessage = MutableStateFlow<String?>(null)

    private fun connectIfNotConnected() {
        if (socket == null) {
            connect()
        }
    }

    fun connect() {
        viewModelScope.launch {
            try {
                socket = client.webSocketSession(
                    method = HttpMethod.Get,
                    host = "test.lazyloops.se",
                    path = "/"
                )

                // Send initial message
                socket?.send("App connected")

                // Listen to incoming messages
                socket?.let { session ->
                    for (frame in session.incoming) {
                        when (frame) {
                            is Frame.Text -> {
                                recentMessage.value = frame.readText()
                                println("Received: ${frame.readText()}")
                            }
                            is Frame.Binary -> println("Binary frame received.")
                            else -> {}
                        }
                    }
                }
            } catch (e: Exception) {
                println("Error: ${e.localizedMessage}")
            }
        }
    }

    fun sendMessage(text: String) {
        viewModelScope.launch {
            try {
                connectIfNotConnected()
                socket?.send(text)
            } catch (e: Exception) {
                println("Failed to send message: ${e.localizedMessage}")
            }
        }
    }

    fun sendPictureCommand() {
        viewModelScope.launch {
            try {
                connectIfNotConnected()
                socket?.send("""{ "rover_id": "rover-001", "command": "PIC" }""")
            } catch (e: Exception) {
                println("Failed to send message: ${e.localizedMessage}")
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        viewModelScope.launch {
            socket?.close()
        }
    }
}

class VideoViewModel: ViewModel() {
    private var videoSocket: WebSocketSession? = null

    fun startStream() {
        viewModelScope.launch {
            try {
                videoSocket = client.webSocketSession(
                    method = HttpMethod.Get,
                    host = "test.lazyloops.se:9000",
                    path = "/"
                )

                // Send initial message
                videoSocket?.send("App connected")

                // Listen to incoming messages
                videoSocket?.let { session ->
                    for (frame in session.incoming) {
                        // Send frame to a LiveData?
                    }
                }
            } catch (e: Exception) {
                println("Error: ${e.localizedMessage}")
            }
        }
    }

}