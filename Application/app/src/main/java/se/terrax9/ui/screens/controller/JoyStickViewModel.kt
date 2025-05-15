package se.terrax9.ui.screens.controller

import kotlin.math.absoluteValue

class JoyStickViewModel(
    val command: (Float, Float) -> String,
    val sendMessage: (String) -> Unit
) {
    private var lastSent: Pair<Float, Float> = Pair(0f, 0f)
    private var lastSentTime = 0L  // time in millis

    private var incoming: String = ""

    fun onMove(x: Float, y: Float) {
        val new = Pair(x, y)
        val now = System.currentTimeMillis()
        if (isForceful(new.first.absoluteValue, new.second.absoluteValue) || shouldBeSentAgain(
        //if (shouldBeSentAgain(
                new,
                lastSent
            ) && now - lastSentTime >= 100
        ) {
            val commandStr = command(new.first, new.second)
            sendMessage(commandStr)
            lastSent = new
            lastSentTime = now
        }
    }

    fun isForceful(x: Float, y: Float): Boolean {
        return (x == 0f && lastSent.first != 0f) || (y == 0f && lastSent.second != 0f) || (x == 1f && lastSent.first != 1f) || (y == 1f && lastSent.second != 1f)
    }

    private fun shouldBeSentAgain(new: Pair<Float, Float>, old: Pair<Float, Float>): Boolean {
        val newMaxValue =
            (new.first.absoluteValue == 1f && old.first.absoluteValue != 1f) ||
                    (new.second.absoluteValue == 1f && old.second.absoluteValue != 1f)
        val newMinValue =
            (new.first.absoluteValue == 0f && old.first.absoluteValue != 0f) ||
                    (new.second.absoluteValue == 0f && old.second.absoluteValue != 0f)
        val newExtremeValue = newMinValue || newMaxValue

        val newValue =
            (lastSent.first - new.first).absoluteValue > 0.1 ||
                    (lastSent.second - new.second).absoluteValue > 0.1

        return newValue || newExtremeValue
    }
}
