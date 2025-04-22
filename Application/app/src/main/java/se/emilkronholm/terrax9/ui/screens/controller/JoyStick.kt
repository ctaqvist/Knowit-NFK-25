package se.emilkronholm.terrax9.ui.screens.controller

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import se.emilkronholm.terrax9.ui.theme.AppColors
import kotlin.math.absoluteValue
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

//TODO: Restructure :)
@Composable
fun JoyStick(
    isFixed: Boolean = false,
    onMove: (x: Float, y: Float) -> Unit = { _, _ -> }
) {
    val baseSize = 300.dp
    val knobSize = 120.dp

    // These two values represent a maximum offset the joystick's center can be from it's starting point.
    // VisualOffset should be slightly less than actualOffset as otherwise it is hard to "max out" the speed.
    val maxVisualOffset = with(LocalDensity.current) { ((baseSize - knobSize) / 1.5f).toPx() }
    val maxActualOffset = with(LocalDensity.current) { ((baseSize - knobSize) / 1.7f).toPx() }

    var offset by remember { mutableStateOf(Offset.Zero) }

    Box(
        modifier = Modifier
            .size(baseSize)
            .clip(CircleShape)
            .background(AppColors.SecondaryLight)
            .pointerInput(Unit) {
                detectDragGestures(
                    onDragEnd = {
                        offset = Offset.Zero
                        onMove(0f, 0f)
                    },
                    onDrag = { change, dragAmount ->
                        // New offset after drag
                        val newOffset = offset + dragAmount
                        val clampedVisualOffset = newOffset.clampWithin(maxVisualOffset)

                        offset = clampedVisualOffset
                        val normalizedOffset = offset.normalize(maxActualOffset)
                        onMove(normalizedOffset.x, -normalizedOffset.y)

                    }
                )
            },
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .offset { IntOffset(offset.x.roundToInt(), offset.y.roundToInt()) }
                .size(knobSize)
                .clip(CircleShape)
                .background(Color.Black)
        )
    }
}

// Clamps the offset within maxDistance
private fun Offset.clampWithin(maxDistance: Float): Offset {
    return if (this.getDistance() > maxDistance) {
        val angle = atan2(this.y, this.x)

        return Offset(
            x = cos(angle) * maxDistance,
            y = sin(angle) * maxDistance
        )
    } else this
}

private fun Offset.normalize(maxLength: Float): Offset {
    val normalizedX = (this.x / maxLength).coerceIn(-1f, 1f)
    val normalizedY = (this.y / maxLength).coerceIn(-1f, 1f)
    return Offset(normalizedX, normalizedY)
}