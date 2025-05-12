package se.terrax9.viewmodels

import android.content.Context
import android.media.session.MediaSession.Token
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

sealed class UserState {
    data object NeedsAuth : UserState()
    data object SignedOut : UserState()
    data object LoggedIn : UserState()
    data object ConnectedNoRover : UserState()
    data object ConnectedWithRover : UserState()
}

class UserViewModel(private val appContext: Context) : ViewModel() {
    private val _isLoggedIn = MutableStateFlow(false)
    private val _token = MutableStateFlow<String?>(null)
    private val _email = MutableStateFlow<String?>(null)
    private val _serverConnected = MutableStateFlow(false)
    private val _roverConnected = MutableStateFlow(false)

    // Expose a derived UserState
    val userState: StateFlow<UserState> =
        combine(_isLoggedIn, _serverConnected, _roverConnected) { loggedIn, srv, rover ->
            when {
                !loggedIn -> UserState.SignedOut
                loggedIn && !srv -> UserState.LoggedIn
                srv && !rover -> UserState.ConnectedNoRover
                srv && rover -> UserState.ConnectedWithRover
                else -> UserState.NeedsAuth
            }
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), UserState.NeedsAuth)

    fun checkAuth() {
        // Load from disk / secure storage
        val saved = TokenDatabase.loadToken(appContext)
        if (saved != null) {
            _token.value = saved
            _isLoggedIn.value = true
            // optionally trigger server check here
        } else {
            _isLoggedIn.value = false
        }
    }

    fun login(email: String, token: String) {
        _email.value = email
        _token.value = token
        _isLoggedIn.value = true
        TokenDatabase.saveToken(appContext, token)
    }

    fun logout() {
        _isLoggedIn.value = false
        _token.value = null
        _email.value = null
        TokenDatabase.clearToken(appContext)
    }

    fun onServerConnected(connected: Boolean) {
        _serverConnected.value = connected
    }

    fun onRoverConnected(connected: Boolean) {
        _roverConnected.value = connected
    }
}
