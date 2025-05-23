package se.terrax9.services

import java.util.Locale

object Commands {

    private val roverId: String = "rover-001"

    private fun createCommand(command: Command): String {
        return """{ "rover_id": "$roverId", "command": "${command.value}" }"""
    }

    private fun createSteer(x: Float, y: Float): String {
        return """{ "rover_id": "$roverId", "steer": {"x": "${
            String.format(
                Locale.ROOT,
                "%.2f",
                x
            )
        }", 
            |"y": "${String.format(Locale.ROOT, "%.2f", y)}"} }""".trimMargin()
    }

    private fun createSteerArm(_shoulder: Float, _elbow: Float, _claw: Float): String {

        val shoulder = String.format(Locale.ROOT, "%.2f", _shoulder)
        val elbow = String.format(Locale.ROOT, "%.2f", _elbow)
        val claw = String.format(Locale.ROOT, "%.2f", _claw)

        return """{ "rover_id": "$roverId", "steer_arm": {"shoulder": "$shoulder", "axis": "$elbow", "claw": "$claw"}}""".trimMargin()
    }

    // Use these functions to create commands
    fun takePicture(): String = createCommand(Command.TAKE_PICTURE)
    fun startStream(): String = createCommand(Command.START_STREAM)
    fun stopStream(): String = createCommand(Command.STOP_STREAM)
    fun tankTurn(): String = createCommand(Command.TANK_TURN)
    fun ping(): String = createCommand(Command.PING)
    fun startHeadlights(): String = createCommand(Command.START_HEADLIGHTS)
    fun closeHeadlights(): String = createCommand(Command.CLOSE_HEADLIGHTS)
    fun connectToRover(): String = createCommand(Command.CONNECT)
    fun steer(x: Float, y: Float): String = createSteer(x, y)
    fun steerArm(shoulder: Float, elbow: Float, claw: Float): String =
        createSteerArm(shoulder, elbow, claw)


    private enum class Command(val value: String) {
        // Used enums to prevent errors caused by typos or inconsistent string
        TAKE_PICTURE("PIC"),
        START_STREAM("STREAM"),
        STOP_STREAM("END-STREAM"),
        TANK_TURN("TANKTURN"),
        PING("ping"),
        START_HEADLIGHTS("LIGHTS_ON"),
        CLOSE_HEADLIGHTS("LIGHTS_OFF"),
        CONNECT("connect")
    }
}