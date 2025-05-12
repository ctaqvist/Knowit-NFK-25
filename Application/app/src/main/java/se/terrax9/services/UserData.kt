package se.terrax9.services

import android.media.session.MediaSession.Token
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class UserState {
    NEEDS_AUTH,
    SIGNED_OUT,
    LOGGED_IN,
    CONNECTED_TO_SERVER_WITHOUT_ROVER,
    CONNECTED_TO_SERVER_AND_ROVER
}

object UserData {
    var _isLoggedIn by mutableStateOf(false)
    var token by mutableStateOf<String?>(null)
    var email by mutableStateOf<String?>(null)
    var selectedRoverID by mutableStateOf<String?>(null)

    var status by mutableStateOf<UserState>(UserState.NEEDS_AUTH)

    fun login(email: String, token: String) {
        UserData._isLoggedIn = true
        UserData.token = token
        UserData.email = email

        //TODO: Store token on drive to save login between app-restarts
    }

    fun logout() {
        //TODO: Send logout POST request to server
        UserData._isLoggedIn = false
        UserData.token = null
        UserData.email = null
    }

    fun isLoggedIn(): Boolean {
        return _isLoggedIn ?: false
    }
}