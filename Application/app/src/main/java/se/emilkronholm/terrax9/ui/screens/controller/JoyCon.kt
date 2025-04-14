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
import kotlin.math.PI
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

@Composable
fun JoyCon(
    onMove: (x: Float, y: Float) -> Unit = { _, _ -> },
    isFixed: Boolean = false
) {
    val baseSize = 300.dp
    val knobSize = 120.dp
    val maxOffset = with(LocalDensity.current) { ((baseSize - knobSize) / 1.5f).toPx() }

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
                        val newOffset = offset + dragAmount

                        val limitedOffset = if (newOffset.getDistance() > maxOffset) {
                            val angle = atan2(newOffset.y, newOffset.x) * -2

                            Offset(
                                x = cos(angle) * maxOffset,
                                y = sin(angle) * maxOffset
                            )
                        } else {
                            newOffset
                        }

                        offset = limitedOffset

                        val normalizedX = (offset.x / maxOffset).coerceIn(-1f, 1f)
                        val normalizedY = (offset.y / maxOffset).coerceIn(-1f, 1f)
                        val angleInDegrees =
                            Math
                                .toDegrees(atan2(newOffset.y, newOffset.x).toDouble())
                                .toFloat() * -1
                        println(angleInDegrees)

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