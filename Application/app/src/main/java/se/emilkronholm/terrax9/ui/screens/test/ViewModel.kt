package se.emilkronholm.terrax9.ui.screens.test

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.websocket.WebSockets
import io.ktor.client.plugins.websocket.webSocketSession
import io.ktor.http.HttpMethod
import io.ktor.websocket.Frame
import io.ktor.websocket.WebSocketSession
import io.ktor.websocket.close
import io.ktor.websocket.readText
import io.ktor.websocket.send
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch

val client = HttpClient(CIO) {
    install(WebSockets)
}

class ViewModel(private val uri: String = "") : ViewModel() {
    private var socket: WebSocketSession? = null
    private var job: Job? = null

    // PUBLIC INTERFACE
    private val _recentMessage = MutableSharedFlow<String>()
    val recentMessage = _recentMessage.asSharedFlow()

    var reloadVideoKey = MutableStateFlow<Int>(0)

    fun sendConnect() = viewModelScope.launch { connect() }
    fun sendDisconnect() = viewModelScope.launch { disconnect() }
    fun sendStartStream() = sendCommand("STREAM")
    fun sendStopStream() = sendCommand("END-STREAM")
    fun sendTakePicture() = sendCommand("PIC")
    fun sendTankTurn() = sendCommand("TANKTURN")
    fun sendPing() = sendMessage("ping")
    fun sendReloadVideo() = reloadVideoKey.value++
    fun sendStartHeadlights() = sendCommand("HEADLIGHT_ON")
    fun sendCloseHeadlights() = sendCommand("HEADLIGHT_OFF")

    // PRIVATE INTERFACE
    private fun isConnected() = socket != null
    private suspend fun disconnect() {
        _recentMessage.emit("Disconnect...")
        socket?.close()
    }

    private suspend fun connect() {
        try {
            socket = client.webSocketSession(
                method = HttpMethod.Get,
                host = uri,
                path = "/"
            )

            // Send initial message
            socket?.send("It is me i'm the problem it's me")

            // Listen to incoming messages
            socket?.let { session ->
                for (frame in session.incoming) {
                    if (frame is Frame.Text) {
                        println("Received: ${frame.readText()}")
                        _recentMessage.emit(frame.readText())
                    } else {
                        println("Received message that wasn't text.")
                    }
                }
            }

        } catch (e: Exception) {
            println("Error: ${e.localizedMessage}")
        }
    }

    // Helper to send messages
    private fun sendCommand(command: String) {
        sendMessage("""{ "rover_id": "rover-001", "command": "$command" }""")
    }

    private fun sendMessage(message: String) {
        if (socket == null) {
            viewModelScope.launch {
                _recentMessage.emit("ERR: No connection...")
            }
        }

        job?.cancel()
        job = viewModelScope.launch {
            try {
                socket?.send(message)
            } catch (e: Exception) {
                _recentMessage.emit("ERR: ${e.localizedMessage}")
                println("Failed to send message: ${e.localizedMessage}")
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        viewModelScope.launch {
            socket?.send("It is me again! I will now disconnect! :)")
            socket?.close()
        }
    }

}

