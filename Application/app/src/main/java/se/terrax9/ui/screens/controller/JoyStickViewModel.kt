package se.terrax9.ui.screens.controller

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlin.math.absoluteValue

class JoyStickViewModel(val command: (Float, Float) -> String, val sendMessage: (String) -> Unit) : ViewModel() {
    private var lastSent: Pair<Float, Float> = Pair(0f, 0f)

    fun onMove(new: Pair<Float, Float>) {
        if (shouldBeSentAgain(new, lastSent)) {
            sendMessage(command(new.first, new.second))
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
        return newExtremeValue
    }
}