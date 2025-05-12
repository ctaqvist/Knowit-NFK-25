package se.terrax9.ui.screens.controller

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import se.terrax9.BuildConfig
import se.terrax9.services.DataService
import se.terrax9.services.Commands

class ControllerViewModel() : ViewModel() {

    enum class ServerStatus {
        CONNECTED,
        DISCONNECTED
    }

    enum class RoverStatus {
        OK,
        BAD,
        DECENT,
        HALFWAYDECENT,

    }

    private val dataService = DataService(BuildConfig.WS_BASE_URL, { state ->
        _serverStatus.value = if (state) ServerStatus.CONNECTED else ServerStatus.DISCONNECTED
    })
    private var job: Job? = null

    private val _isLighted = MutableStateFlow(true)
    val isLighted: StateFlow<Boolean> = _isLighted

    private val _serverStatus = MutableStateFlow(ServerStatus.DISCONNECTED)
    val serverStatus: StateFlow<ServerStatus> = _serverStatus

    private val _roverStatus = MutableStateFlow(RoverStatus.BAD)
    val roverStatus: StateFlow<RoverStatus> = _roverStatus

    fun sendCommand(command: String) {
        viewModelScope.launch {
            dataService.sendMessage(command)
        }
    }

    override fun onCleared() {
        super.onCleared()
        dataService.close()
    }

    // Helpers
    fun connect() = sendCommand(Commands.connectToRover())
    fun takePhoto() = sendCommand(Commands.takePicture())
    fun toggleLights() {
        _isLighted.value = !_isLighted.value

        if (_isLighted.value) {
            sendCommand(Commands.closeHeadlights())
        } else {
            sendCommand(Commands.startHeadlights())
        }
    }
}