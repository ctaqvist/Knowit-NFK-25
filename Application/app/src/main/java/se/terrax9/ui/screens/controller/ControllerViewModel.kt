package se.terrax9.ui.screens.controller

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import se.terrax9.BuildConfig
import se.terrax9.services.DataService
import se.terrax9.services.Commands
import se.terrax9.services.UserData

class ControllerViewModel() : ViewModel() {

    enum class ServerStatus {
        CONNECTED,
        DISCONNECTED
    }

    enum class RoverStatus {
        OK,
        BAD,
        DECENT,
        HALFWAYDECENT
    }

    private val dataService = DataService(BuildConfig.WS_BASE_URL,
        { state ->
            _serverStatus.value = if (state) ServerStatus.CONNECTED else ServerStatus.DISCONNECTED
        }, this::onRoverBad)

    fun onRoverBad(isGood: Boolean) {
        _roverStatus.value = if (isGood) RoverStatus.OK else RoverStatus.BAD
        if (!isGood) {
            _serverStatus.value = ServerStatus.DISCONNECTED
            dataService.disconnect()
            viewModelScope.launch {
                _errorMessage.emit("Connection attempt failed because rover is not connected.")
            }
        }
    }
    private var job: Job? = null
    val BACKDOOR = true

    private val _isLighted = MutableStateFlow(true)
    val isLighted: StateFlow<Boolean> = _isLighted

    private val _serverStatus = MutableStateFlow(ServerStatus.DISCONNECTED)
    val serverStatus: StateFlow<ServerStatus> = _serverStatus

    private val _roverStatus = MutableStateFlow(RoverStatus.BAD)
    val roverStatus: StateFlow<RoverStatus> = _roverStatus

    private val _errorMessage = MutableSharedFlow<String>()
    val errorMessage: SharedFlow<String> = _errorMessage

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

    fun toggleConnect() {
        if (serverStatus.value == ServerStatus.CONNECTED) {
            dataService.disconnect()
        } else {
            sendCommand(Commands.connectToRover())
        }

        UserData.roverStatus = true
    }
}