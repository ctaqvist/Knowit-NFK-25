package se.terrax9.ui.screens.controller

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import se.terrax9.services.DataService

class ViewModel(roverID: String): ViewModel() {

    val dataService = DataService("terrax9.se")
    var job: Job? = null
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
}