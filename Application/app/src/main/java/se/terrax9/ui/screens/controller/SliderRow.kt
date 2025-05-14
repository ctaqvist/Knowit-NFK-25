package se.terrax9.ui.screens.controller

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.Job
import se.terrax9.services.Commands
import se.terrax9.services.DataService
import kotlin.math.absoluteValue

@Composable
fun SliderRow(onChange: (Float, Float, Float) -> Unit) {
    val vm = SliderRowViewModel(onChange = { x, y, z ->
        onChange(x, y, z)

    })

    Row() {
        Slider(onMove = { vm.updateShoulder(it) })

        Slider(onMove = { vm.updateElbow(it) })

        Slider(onMove = { vm.updateClaw(it) })
    }
}

class SliderRowViewModel(val onChange: (Float, Float, Float) -> Unit) {
    var shoulder: Float = 0f
    private var _oldShoulder: Float = shoulder

    var elbow: Float = 0f
    private var _oldElbow: Float = elbow

    var claw: Float = 0f
    private var _oldClaw: Float = claw

    private var lastSentTime = 0L

    fun updateShoulder(it: Float) {
        shoulder = it
        _onChange()
    }

    fun updateElbow(it: Float) {
        elbow = it
        _onChange()
    }

    fun updateClaw(it: Float) {
        claw = it
        _onChange()
    }

    private fun _onChange() {
        val now = System.currentTimeMillis()
        val forceful =
            isForceful(shoulder, _oldShoulder) ||
                    isForceful(elbow, _oldElbow) ||
                    isForceful(claw, _oldClaw)

        val shouldSend =
            forceful || (now - lastSentTime >= 500 &&
                    (shouldBeSentAgain(shoulder, _oldShoulder) ||
                            shouldBeSentAgain(elbow, _oldElbow) ||
                            shouldBeSentAgain(claw, _oldClaw)))

        if (shouldSend) {
            onChange(shoulder, elbow, claw)

            _oldClaw = claw
            _oldElbow = elbow
            _oldShoulder = shoulder
            lastSentTime = now
        }
    }

    private fun shouldBeSentAgain(new: Float, old: Float): Boolean {
        val newMaxValue = new.absoluteValue == 1f && old.absoluteValue != 1f
        val newMinValue = new.absoluteValue == 0f && old.absoluteValue != 0f
        val newExtremeValue = newMinValue || newMaxValue

        val newValue = (old - new).absoluteValue > 0.1
        return newValue || newExtremeValue
    }

    private fun isForceful(new: Float, old: Float): Boolean {
        return (new == 0f && old != 0f) ||
                (new == 1f && old != 1f) ||
                (new == -1f && old != -1f)
    }
}