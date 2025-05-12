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
import kotlinx.coroutines.Job
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

            if (UserData.token == null) {
                Log.e("Fatal", "Tried to connect but there were no token.")
                UserData.logout()
                return
            }

            println("Trying to connect to server...")
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

                socket!!.send("""{"rover_id": "rover-001", "command": "connect" }""")
            }
            println("Emil")
            println(socket == null)

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
                            //println("Received: ${frame.readText()}")
                        } else {
                            println("Received message that wasn't text.")
                        }
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
        val state = json.optString("state")
        val someOther = json.optString("otherKey")

        when (state) {
            "rover_not_connected" -> {
                UserData.selectedRoverID = null
            }

            "rover_occupied" -> {
            }

            "rover_connected" -> {

            }

            "rover_disconnected" -> {

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
}