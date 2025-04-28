package se.terrax9.ui.screens.test

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
    private val ROVER_ID = "rover-001"
    private var socket: WebSocketSession? = null
    private var job: Job? = null
    private val commandProtocol = Commands
    // PUBLIC INTERFACE
    private val _recentMessage = MutableSharedFlow<String>()
    val recentMessage = _recentMessage.asSharedFlow()

    var reloadVideoKey = MutableStateFlow<Int>(0)

    fun sendConnect() = viewModelScope.launch { connect() }
    fun sendDisconnect() = viewModelScope.launch { disconnect() }
    fun sendStartStream() = sendMessage(commandProtocol.startStream())
    fun sendStopStream() = sendMessage(commandProtocol.stopStream())
    fun sendTakePicture() = sendMessage(commandProtocol.takePicture())
    fun sendTankTurn() = sendMessage(commandProtocol.tankTurn())
    fun sendPing() = sendMessage(commandProtocol.ping())
    fun sendReloadVideo() = reloadVideoKey.value++
    fun sendStartHeadlights() = sendMessage(commandProtocol.startHeadlights())
    fun sendCloseHeadlights() = sendMessage(commandProtocol.closeHeadlights())

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

