package se.terrax9.services

import android.media.session.MediaSession.Token


object UserData {
    var isLoggedIn: Boolean? = null
    var token: String? = null
    var email: String? = null

    fun login(email: String, token: String) {
        UserData.isLoggedIn = true
        UserData.token = token
        UserData.email = email

        //TODO: Store token on drive to save login between app-restarts
    }

    fun logout() {
        //TODO: Send logout POST request to server
        UserData.isLoggedIn = false
        UserData.token = null
        UserData.email = null
    }

    fun isLoggedIn(): Boolean {
        return isLoggedIn?: false
    }
}