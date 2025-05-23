package se.terrax9.ui.screens.controller

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import se.terrax9.R
import kotlin.math.absoluteValue
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

@Composable
fun Slider(
    getCommand: (Float, Float) -> String = { x, y -> "$x, $y" },
    onMove: (Float) -> Unit = { _ -> },
    text: String = ""
) {
    val baseSize = 240.dp
    val knobSize = 140.dp

    // Visual offset defines the maximum distance the joystick can be dragged before being capped.
    // This value is used to visually cap the movement of the joystick
    val maxVisualOffset = with(LocalDensity.current) { ((baseSize - knobSize) / 1.2f).toPx() }

    // 95% of visualOffset, meaning the outer 5% will always be capped to max value in all directions.
    // This value actually caps the positions a bit before it visually caps out
    val maxActualOffset = maxVisualOffset * 0.95f
    val deadZoneOffset = 0.2

    // Keeps track of the offset of the knob to origin
    var joyStickOffset by remember { mutableStateOf(Offset.Zero) }

    // Raw offset from origin and finger
    var rawOffset by remember { mutableStateOf(Offset.Zero) }
    Box(
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .height(baseSize)
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragEnd = {
                            joyStickOffset = Offset.Zero
                            rawOffset = Offset.Zero
                            onMove(0f)
                        },
                        onDrag = { change, dragAmount ->
                            // Update fingerOffset
                            rawOffset += dragAmount

                            // New offset after drag
                            val newOffset = joyStickOffset + dragAmount
                            joyStickOffset = newOffset.clampWithin(maxVisualOffset)

                            // Normalize offset and emit onMove
                            val normalizedOffset = joyStickOffset.normalize(maxActualOffset)
                            // If offset is less than deadzone, always send 0, 0
                            if (normalizedOffset.getDistance() > deadZoneOffset) {
                                onMove(-normalizedOffset.y)
                            } else onMove(0f)
                        }
                    )
                },
            contentAlignment = Alignment.Center
        ) {
            Box (
                modifier = Modifier
                    .offset { IntOffset(0, joyStickOffset.y.roundToInt()) },
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.joystickcenter),
                    contentDescription = "Joystick center",
                    modifier = Modifier
                        .size(knobSize)
                        .zIndex(10f)
                )

                Text(
                    text, style = TextStyle(
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.lexendera)),
                        fontWeight = FontWeight(500),
                        color = Color(0xFFFFFFFF),

                        textAlign = TextAlign.Center,
                    ), modifier = Modifier.zIndex(11f)
                )
            }
        }
        Image(
            painter = painterResource(id = R.drawable.vertical_background),
            contentDescription = "Joystick background",
            modifier = Modifier
                .height(baseSize * 1.3f)
                .zIndex(9f)

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

// Normalizes the offset within the range [-1, 1]
private fun Offset.normalize(maxLength: Float): Offset {
    val normalizedX = (this.x / maxLength).coerceIn(-1f, 1f)
    val normalizedY = (this.y / maxLength).coerceIn(-1f, 1f)
    return Offset(normalizedX, normalizedY)
}

// Helper to fix the offset onto the main axis, which is the axis with greatest distance from origin.
private fun Offset.fixToMainAxle(): Offset {
    var x = this.x
    var y = this.y
    if (x.absoluteValue < y.absoluteValue) x = 0f else y = 0f
    return Offset(x, y);
}

@Preview
@Composable
fun SliderPreview() {
    Slider(text = "CLAW")
}