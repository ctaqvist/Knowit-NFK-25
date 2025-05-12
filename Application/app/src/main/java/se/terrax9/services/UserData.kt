package se.terrax9.services

import android.media.session.MediaSession.Token
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class UserState {
    NEEDS_AUTH,
    SIGNED_OUT,
    LOGGED_IN,
    CONNECTED_TO_SERVER
}

object UserData {
    var _isLoggedIn by mutableStateOf(false)
    var token by mutableStateOf<String?>(null)
    var email by mutableStateOf<String?>(null)
    var selectedRoverID by mutableStateOf<String?>(null)
    var status by mutableStateOf<UserState>(UserState.SIGNED_OUT)

    fun login(email: String, token: String) {
        UserData._isLoggedIn = true
        UserData.token = token
        UserData.email = email
        status = UserState.LOGGED_IN

        //TODO: Store token on drive to save login between app-restarts
    }

    fun logout() {
        //TODO: Send logout POST request to server
        UserData._isLoggedIn = false
        UserData.token = null
        UserData.email = null
        status = UserState.SIGNED_OUT
    }

    fun onConnectToServer() {
        status = UserState.CONNECTED_TO_SERVER
    }

    fun isLoggedIn(): Boolean {
        return _isLoggedIn ?: false
    }
}