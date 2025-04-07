package se.emilkronholm.terrax9

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.http.HttpMethod
import io.ktor.websocket.*
import kotlinx.coroutines.*

val client = HttpClient(CIO) {
    install(WebSockets)
}

class AppViewModel : ViewModel() {

    private var socket: WebSocketSession? = null

    fun connect() {
        viewModelScope.launch {
            try {
                socket = client.webSocketSession(
                    method = HttpMethod.Get,
                    host = "test.lazyloops.se",
                    path = "/"
                )

                // Send initial message
                socket?.send("Hello server 👋")

                // Listen to incoming messages
                socket?.let { session ->
                    for (frame in session.incoming) {
                        when (frame) {
                            is Frame.Text -> println("Received: ${frame.readText()}")
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
                socket?.send(text)
            } catch (e: Exception) {
                println("Failed to send message: ${e.localizedMessage}")
            }
        }
    }

    fun sendPictureCommand() {
        viewModelScope.launch {
            try {
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
