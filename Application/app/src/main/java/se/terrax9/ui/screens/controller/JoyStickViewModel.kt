package se.terrax9.ui.screens.controller

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlin.math.absoluteValue

class JoyStickViewModel(val command: (Float, Float) -> String, val sendMessage: (String) -> Unit) {
    private var lastSent: Pair<Float, Float> = Pair(0f, 0f)

    fun onMove(x: Float, y: Float) {
        val new: Pair<Float, Float> = Pair(x, y)
        if (shouldBeSentAgain(new, lastSent)) {
            val command: String = command(new.first, new.second)
            sendMessage(command)
            lastSent = new
        }
    }

    private fun shouldBeSentAgain(new: Pair<Float, Float>, old: Pair<Float, Float>): Boolean {
        val newMaxValue =
            (new.first.absoluteValue == 1f && old.first.absoluteValue != 1f) ||
                    (new.second.absoluteValue == 1f && old.second.absoluteValue != 1f)
        val newMinValue = (new.first.absoluteValue == 0f && old.first.absoluteValue != 0f)
                || (new.second.absoluteValue == 0f && old.second.absoluteValue != 0f)
        val newExtremeValue = newMinValue || newMaxValue

        val newValue =
            (lastSent.first - new.first).absoluteValue > 0.02 || ((lastSent.second - new.second).absoluteValue > 0.02)
        return newValue || newExtremeValue
    }
}