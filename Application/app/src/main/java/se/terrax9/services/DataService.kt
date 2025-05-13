package se.terrax9.services

import android.util.Log
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.websocket.WebSockets
import io.ktor.client.plugins.websocket.webSocketSession
import io.ktor.http.HttpMethod
import io.ktor.http.URLProtocol
import io.ktor.http.path
import io.ktor.websocket.Frame
import io.ktor.websocket.WebSocketSession
import io.ktor.websocket.close
import io.ktor.websocket.readText
import io.ktor.websocket.send
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.json.JSONObject
import kotlin.math.absoluteValue

val client = HttpClient {
    install(WebSockets)

    install(HttpTimeout) {
        requestTimeoutMillis = 5000
        connectTimeoutMillis = 5000
        // 5 minutes
        socketTimeoutMillis = 1000 * 60 * 5
    }
}

// This data service controls data transfer
// It acts as a domain layer and is not bound by android context
// As of ticket 145, we will connect and suspend on the UI thread meaning that the UI freezes as we are connecting to the server.
// This due to a bug where we connect many times and create duplicate listeners
class DataService(private val uri: String = "", val onServerStatusChange: (Boolean) -> Unit = {}, val onRoverStatusChange: (Boolean) -> Unit ={}) {
    private var receiveJob: Job? = null

    private var socket: WebSocketSession? = null
    var socketActive = false

    fun close() {
        runBlocking {
            println("Data service was closed now...")
            socket?.close()
            receiveJob?.cancel()
            updateIsActive()
        }
    }

    private fun updateIsActive() {
        socketActive = socket?.isActive ?: false
        onServerStatusChange(socketActive)
    }

    // Initialize a socket and create callbacks
    private suspend fun connect() {
        try {
            updateIsActive()
            socket?.close()
            receiveJob?.cancel()

            if (UserData.token == null) {
                Log.e("Fatal", "Tried to connect but there were no token.")
                UserData.logout()
                return
            }

            println ("Trying to connect to server...")
            println("Usertoken is: ${UserData.token}")
            runBlocking {
                socket = client.webSocketSession {
                    url {
                        protocol = URLProtocol.WS
                        host = "terrax9.se"
                        path("/")
                        port = 8081
                        parameters.append("token", UserData.token!!) // Crash if no token provided
                    }
                }
            }
            // If no failure, we have successfully opened a websocket and connected to server
            updateIsActive()

            // Send initial message
            socket?.send("It is me i'm the problem it's me")

            // Listen to incoming messages
            socket?.let { session ->
                // We run the recieve job on GlobalScope because it is a simple fix to ensure
                // the job isn't tied to any lifecycle.
                // This may not be an ideal solution as it is easy to get leaks.
                // In future this should be done in a different way.
                receiveJob = GlobalScope.launch {
                    try {
                        for (frame in session.incoming) {
                            if (frame is Frame.Text) {
                                val s = frame.readText()
                                println("Received: ${s}")
                                handleIncomingMessage(s)
                            }
                        }
                    } finally {
                        println("Socket is super closed")
                        socket?.close()
                        socketActive = false
                        onServerStatusChange(false)
                    }
                }
            }
            println("Connected to server")
        } catch (e: Exception) {
            println("Error: ${e.localizedMessage}")
            println("ErrorCause: ${e.cause}")
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

    fun handleIncomingMessage(payload: String) {
        val json = JSONObject(payload)
        val state = json.optString("rover_status")

        when (state) {
            "disconnected" -> {
                println("Failed to connect to rover!")
                UserData.selectedRoverID = null
                onRoverStatusChange(false)
            }

            "connected" -> {
                // TODO: FIX HARDCODED VALUE
                UserData.selectedRoverID = "rover-001"
                onRoverStatusChange(true)
            }

            else -> {
                println("Got other message")
            }
        }
    }

    suspend fun sendMessage(message: String) {
        ensureOpenConnection()
        try {
            println("Sending a new message of: $message")
            socket?.send(message)
        } catch (e: Exception) {
            println("Failed to send message: ${e.localizedMessage}")
        }
    }

    fun disconnect() {
        runBlocking {
            receiveJob?.cancel()
            socket?.close()
            socketActive = false
            onServerStatusChange(false)
        }
    }
}