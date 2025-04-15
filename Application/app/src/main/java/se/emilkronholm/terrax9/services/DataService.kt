package se.emilkronholm.terrax9.services

import android.annotation.SuppressLint
import androidx.lifecycle.viewModelScope
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.websocket.WebSockets
import io.ktor.client.plugins.websocket.webSocketSession
import io.ktor.http.HttpMethod
import io.ktor.websocket.Frame
import io.ktor.websocket.WebSocketSession
import io.ktor.websocket.close
import io.ktor.websocket.readText
import io.ktor.websocket.send
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import kotlin.math.absoluteValue

val client = HttpClient {
    install(WebSockets)

    install(HttpTimeout) {
        requestTimeoutMillis = 5000
        connectTimeoutMillis = 5000
        socketTimeoutMillis = 1000*60*5
    }
}

class DataService(private val uri: String = "") {
    private var socket: WebSocketSession? = null
    private var receiveJob: Job? = null

    init {
        runBlocking {
            connect()
        }
    }

    fun connectBlocking() {
        runBlocking {
            connect()
        }
    }

    private suspend fun connect() {
        try {
            socket?.close()
            receiveJob?.cancel()

            println("Trying to connect to server...")
            runBlocking {
                socket = client.webSocketSession(
                    method = HttpMethod.Get,
                    host = uri,
                    path = "/"
                )
            }

            // Send initial message
            socket?.send("It is me i'm the problem it's me")

            // Listen to incoming messages
            socket?.let { session ->
                receiveJob = kotlinx.coroutines.GlobalScope.launch {
                    for (frame in session.incoming) {
                        if (frame is Frame.Text) {
                            println("Received: ${frame.readText()}")
                        } else {
                            println("Received message that wasn't text.")
                        }
                    }
                }
            }
            println("Connected to server")
        } catch (e: Exception) {
            println("Error: ${e.localizedMessage}")
        }
    }

    fun ensureOpenConnection() {
        if (socket == null || socket?.isActive == false) {
            println("Socket seems to be closed or null, connecting again.")
            runBlocking {
                socket?.close()
                connect()
            }
        } else {
            println("We are already connected")
        }
    }

    // Helper to send messages
    fun sendCommand(command: String) {
        sendMessage("""{ "rover_id": "rover-001", "command": "$command" }""")
    }

    var lastX = 0f;
    var lastY = 0f;
    @SuppressLint("DefaultLocale")
    suspend fun sendSteer(x: Float, y: Float) = withContext(Dispatchers.IO) {

        if (!(x.absoluteValue == 1f && lastX != 1f || y.absoluteValue == 1f && lastY != 1f)) {
            if ((x != 0f && y != 0f) && ((lastX - x).absoluteValue < 0.02 || (lastY - y).absoluteValue < 0.02)) {
                println("Cancels steer as values are the same as last time")
                return@withContext
            }
        }

        lastX = x
        lastY = y
        sendMessage("""{ "rover_id": "rover-001", "steer": {"x": "${String.format("%.2f", x)}", "y": "${String.format("%.2f", y)}"} }""")
    }

    private fun sendMessage(message: String) {
        ensureOpenConnection()
        runBlocking {
            launch {
                try {
                    socket?.send(message)
                } catch (e: Exception) {
                    println("Failed to send message: ${e.localizedMessage}")
                }
            }
        }
    }
}