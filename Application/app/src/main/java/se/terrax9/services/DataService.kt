package se.terrax9.services

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
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import se.terrax9.ui.screens.test.Commands
import java.util.Locale
import kotlin.math.absoluteValue

val client = HttpClient {
    install(WebSockets)

    install(HttpTimeout) {
        requestTimeoutMillis = 5000
        connectTimeoutMillis = 5000
        // 5 minutes (have not tested this)
        socketTimeoutMillis = 1000 * 60 * 5
    }
}

// This data service controls data transfer
// It acts as a domain layer and is not bound by android context
// As of ticket 145, we will connect and suspend on the UI thread meaning that the UI freezes as we are connecting to the server.
// This due to a bug where we connect many times and create duplicate listeners
class DataService(private val uri: String = "") {
    private var socket: WebSocketSession? = null
    private var receiveJob: Job? = null

    init {
        runBlocking {
            connect()
        }
    }

    fun close() {
        runBlocking {
            socket?.close()
            receiveJob?.cancel()
        }
    }

    // Initialize a socket and create callbacks
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
                // We run the recieve job on GlobalScope because it is a simple fix to ensure
                // the job isn't tied to any lifecycle.
                // This may not be an ideal solution as it is easy to get leaks.
                // In future this should be done in a different way.
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

    // Helper to ensure socket is open. If not it will connect one the main thread.
    fun ensureOpenConnection() {
        if (socket == null || socket?.isActive == false) {
            println("Socket seems to be closed or null, connecting again.")
            // WARNING: This hack works but blocks UI
            runBlocking {
                socket?.close()
                connect()
            }
        } else {
            println("We are already connected")
        }
    }

    private var lastX = 0f
    private var lastY = 0f
    suspend fun sendSteer(x: Float, y: Float) = withContext(Dispatchers.IO) {

        // If X or Y has a new extreme value it must always be updated
        val newMaxValue = (x.absoluteValue == 1f && lastX.absoluteValue != 1f) || (y.absoluteValue == 1f && lastY.absoluteValue != 1f)
        val newMinValue = (x == 0f && lastX != 0f) || (y == 0f && lastY != 0f)
        val newExtremeValue = newMinValue || newMaxValue

        // Only update X and Y if at least one of them has increased 0.02 since last transfer
        val newValue = (lastX - x).absoluteValue > 0.02 || ((lastY - y).absoluteValue > 0.02)

        if (newExtremeValue || newValue) {
            // Send new data message
            sendMessage(Commands.steer(x, y))

            // Update last X and Y
            lastX = x
            lastY = y
        }
    }

    suspend fun sendMessage(message: String) {
        ensureOpenConnection()
        try {
            socket?.send(message)
        } catch (e: Exception) {
            println("Failed to send message: ${e.localizedMessage}")
        }
    }
}