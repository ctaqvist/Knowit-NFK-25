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
    private val dataService = DataService(BuildConfig.WS_BASE_URL)
    private var job: Job? = null

    private val _isLighted = MutableStateFlow(true)
    val isLighted: StateFlow<Boolean> = _isLighted

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