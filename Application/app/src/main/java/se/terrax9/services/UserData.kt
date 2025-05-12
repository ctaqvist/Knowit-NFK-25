package se.terrax9.services

import android.media.session.MediaSession.Token
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class UserState {
    SIGNED_OUT,
    LOGGED_IN
}

enum class RoverState {
    CONNECTION_3,
    CONNECTION_2,
    CONNECTION_1,
    NO_CONNECTION
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

    fun isLoggedIn(): Boolean {
        return _isLoggedIn ?: false
    }

    fun fallBack() {
        if (isLoggedIn()) {
            status = UserState.LOGGED_IN
        } else {
            status = UserState.SIGNED_OUT
        }
    }
}