package se.emilkronholm.terrax9.ui.screens.controller

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.input.pointer.PointerInputChange
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import se.emilkronholm.terrax9.R
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
    val baseSize = 240.dp
    val knobSize = 140.dp

    // These two values represent a maximum offset the joystick's center can be from it's starting point.
    // VisualOffset should be slightly less than actualOffset as otherwise it is hard to "max out" the speed.
    val maxVisualOffset = with(LocalDensity.current) { ((baseSize - knobSize) / 1f).toPx() }

    // 95% of visualOffset, meaning the outer 5% will always be capped to max value in all directions.
    val maxActualOffset = maxVisualOffset * 0.95f
    val deadZoneOffset = 0.2

    var offset by remember { mutableStateOf(Offset.Zero) }

    Box(
        modifier = Modifier
            .size(baseSize)
            .border(
                width = 2.dp,
                color = Color.White,
                shape = RoundedCornerShape(baseSize)
            )
//            .background(color = Color.Cyan)
            //.border(width = 2.dp, color = Color(0xFFFFFFFF), shape = RoundedCornerShape(size = 400.dp)))
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

                        // Only update onMove if offset is greater than the deadzone
                        if (normalizedOffset.getDistance() > deadZoneOffset) {
                            onMove(normalizedOffset.x, -normalizedOffset.y)
                        } else onMove(0f, 0f)
                    }
                )
            },
        contentAlignment = Alignment.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.joystickcenter),
            contentDescription = "Joystick center",
            modifier = Modifier
                .offset { IntOffset(offset.x.roundToInt(), offset.y.roundToInt()) }
                .size(knobSize)
                .zIndex(10f)
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


@Preview
@Composable
fun JoyStickPreview() {
    JoyStick()
}