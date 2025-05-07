package se.terrax9.services

import android.media.session.MediaSession.Token


object UserData {
    var isLoggedIn: Boolean? = null
    var token: Token? = null
    var email: String? = null

    fun login(email: String, token: Token) {
        UserData.isLoggedIn = true
        UserData.token = token
        UserData.email = email
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