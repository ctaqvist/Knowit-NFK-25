package se.emilkronholm.terrax9.ui.screens.controller

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import se.emilkronholm.terrax9.services.DataService
import se.emilkronholm.terrax9.ui.screens.test.Commands

class ViewModel() : ViewModel() {
    val dataService = DataService("terrax9.se")
    var job: Job? = null

    private val _isLighted = MutableStateFlow(true)
    val isLighted: StateFlow<Boolean> = _isLighted

    fun onMovement(x: Float, y: Float) {
        // WARNING: Blocks UI
        dataService.ensureOpenConnection()

        job?.cancel()
        job = viewModelScope.launch {
            println("Sending steer for $x, $y")
            dataService.sendSteer(x, y)
        }
    }

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
        println(_isLighted.value)

//        if (_isLighted.value) {
//            sendCommand(Commands.closeHeadlights())
//        } else {
//            sendCommand(Commands.startHeadlights())
//        }
    }
}