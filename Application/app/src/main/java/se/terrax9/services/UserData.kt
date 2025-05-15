package se.terrax9.services

import android.content.Context
import android.media.session.MediaSession.Token
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class UserState {
    AUTH_NEEDED,
    SIGNED_OUT,
    LOGGED_IN
}

object UserData {
    var _isLoggedIn by mutableStateOf(false)
    var token by mutableStateOf<String?>(null)
    var email by mutableStateOf<String?>(null)
    var selectedRoverID by mutableStateOf<String?>(null)

    var status by mutableStateOf<UserState>(UserState.AUTH_NEEDED)
    var roverStatus by mutableStateOf(true)

    fun login(email: String, token: String, context: Context) {
        UserData._isLoggedIn = true
        UserData.token = token
        UserData.email = email
        UserData.status = UserState.LOGGED_IN

        val sharedPrefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        with(sharedPrefs.edit()) {
            putString("email", email)
            putString("token", token)
            putBoolean("isLoggedIn", true)
            apply()
        }
    }

    fun loadLogin(context: Context) {
        return
        val sharedPrefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val savedToken = sharedPrefs.getString("token", null)
        val savedEmail = sharedPrefs.getString("email", null)
        val loggedIn = sharedPrefs.getBoolean("isLoggedIn", false)

        if (loggedIn && savedToken != null && savedEmail != null) {
            UserData._isLoggedIn = true
            UserData.token = savedToken
            UserData.email = savedEmail
            UserData.status = UserState.LOGGED_IN
        }
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
}