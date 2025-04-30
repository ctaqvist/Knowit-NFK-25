package se.terrax9

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.performTouchInput
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*
import org.junit.Rule
import se.terrax9.ui.screens.controller.JoyStick
import kotlin.math.cos
import kotlin.math.sin

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class JoyStickTest {
    @Test
    fun useAppContext() {
        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        assertEquals("se.emilkronholm.terrax9", appContext.packageName)
    }

    @get:Rule
    val rule = createComposeRule()

    @Test
    fun joystick_test_max_values() {
        var last: Pair<Float, Float>? = null

        rule.setContent {
            JoyStick(isFixed = false) { x, y ->
                last = x to y
            }
        }

        rule.onNodeWithContentDescription("Joystick center")
            .performTouchInput {
                down(center)
                moveBy(Offset(0f, 300f))
            }
        assertEquals(0f, last!!.first, 0.0001f)
        assertEquals(-1f, last!!.second, 0.0001f)

        rule.onNodeWithContentDescription("Joystick center")
            .performTouchInput {
                up()
                down(center)
                moveBy(Offset(0f, -300f))
            }
        assertEquals(0f, last!!.first, 0.0001f)
        assertEquals(1f, last!!.second, 0.0001f)

        rule.onNodeWithContentDescription("Joystick center")
            .performTouchInput {
                up()
                down(center)
                moveBy(Offset(300f, 0f))
            }
        assertEquals(1f, last!!.first, 0.0001f)
        assertEquals(0f, last!!.second, 0.0001f)

        rule.onNodeWithContentDescription("Joystick center")
            .performTouchInput {
                up()
                down(center)
                moveBy(Offset(-300f, 0f))
            }
        assertEquals(-1f, last!!.first, 0.0001f)
        assertEquals(0f, last!!.second, 0.0001f)
    }

    @Test
    fun joystick_all_directions_max() {
        var last: Pair<Float, Float>? = null

        rule.setContent {
            JoyStick(isFixed = false) { x, y ->
                last = x to y
            }
        }

        for (degrees in 0 until 360 step 30) {

            val x: Float = cos(degrees.toDouble()).toFloat()
            val y: Float = sin(degrees.toDouble()).toFloat()

            rule.onNodeWithContentDescription("Joystick center")
                .performTouchInput {
                    down(center)
                    moveBy(Offset(
                        x * 500f,
                        y * -500f
                    ))
                }
            assertEquals(x, last!!.first, 0.05f)
            assertEquals(y, last!!.second, 0.05f)

            rule.onNodeWithContentDescription("Joystick center")
                .performTouchInput {
                    up()
                }
        }
    }
}