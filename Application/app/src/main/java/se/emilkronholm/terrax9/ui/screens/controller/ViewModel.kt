package se.emilkronholm.terrax9.ui.screens.controller

import android.provider.ContactsContract.Data
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import se.emilkronholm.terrax9.services.DataService

enum class Command {
    PIC, START_STREAM, STOP_STREAM, TANK_TURN, HEADLIGHT_ON, HEADLIGHT_OFF, FWD, STOP
}

class ViewModel: ViewModel() {

    val dataService = DataService("terrax9.se")
    var job: Job? = null
    fun onMovement(x: Float, y: Float) {

        dataService.ensureOpenConnection()

        job?.cancel()
        job = viewModelScope.launch {
            println("Sending steer for $x, $y")
            dataService.sendSteer(x, y)
        }
    }

    fun sendCommand(command: Command) {
        dataService.sendCommand(command.toString())
    }
}