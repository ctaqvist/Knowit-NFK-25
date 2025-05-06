package se.terrax9.ui.screens.controller

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test


// This test uses a list of "sentCommand", for each command sent we simply add a string "x,y" into that.
class JoyStickViewModelTest {

    private lateinit var sentCommands: MutableList<String>
    private lateinit var viewModel: JoyStickViewModel
    private val buildCommand: (Float, Float) -> String = { x, y -> "$x,$y" }

    @Before
    fun setUp() {
        sentCommands = mutableListOf()
        viewModel = JoyStickViewModel(buildCommand) { msg ->
            sentCommands.add(msg)
        }
    }

    // Should not be sent as both X and Y is less than 0.2 from origin
    @Test
    fun testInitialMoveWithinThresholdDoesNotSend() {
        viewModel.onMove(0.01f, 0.015f)
        assertTrue("Expected no commands sent", sentCommands.isEmpty())
    }

    @Test
    fun testMoveExceedingThresholdSendsExactlyOnce() {
        viewModel.onMove(0.05f, 0f)
        assertEquals(1, sentCommands.size)
        assertEquals("0.05,0.0", sentCommands.first())
    }

    @Test
    fun testMovingFurtherWithinThresholdAfterSendDoesNotResend() {
        viewModel.onMove(0.05f, 0f)  // sends once
        viewModel.onMove(0.07f, 0f)  // delta = 0.02, not > 0.02
        assertEquals(1, sentCommands.size)
    }

    @Test
    fun testMoveToExtremeAndNoDuplicate() {
        viewModel.onMove(1f, 0f)
        assertEquals(1, sentCommands.size)
        assertEquals("1.0,0.0", sentCommands.first())

        viewModel.onMove(1f, 0f)
        assertEquals(1, sentCommands.size)
    }

    @Test
    fun testReturnToCenterSends() {
        viewModel.onMove(1f, 0f)
        sentCommands.clear()
        viewModel.onMove(0f, 0f)
        assertEquals(1, sentCommands.size)
        assertEquals("0.0,0.0", sentCommands.first())
    }

    @Test
    fun testCombinedAxisChanges() {
        viewModel.onMove(0.01f, 0.01f)
        assertTrue(sentCommands.isEmpty())

        viewModel.onMove(0f, 0.5f)
        assertEquals("0.0,0.5", sentCommands.last())

        viewModel.onMove(0f, 0f)
        assertEquals("0.0,0.0", sentCommands.last())

        viewModel.onMove(1f, -1f)
        assertEquals("1.0,-1.0", sentCommands.last())

        // small jitter – no new send
        val before = sentCommands.size
        viewModel.onMove(0.99f, -0.99f)
        assertEquals(before, sentCommands.size)
    }
}
