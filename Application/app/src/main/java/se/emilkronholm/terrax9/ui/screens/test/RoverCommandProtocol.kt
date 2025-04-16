package se.emilkronholm.terrax9.ui.screens.test

class RoverCommandProtocol(private val roverId: String) {

    private fun createCommand(command: Command): String {
        return """{ "rover_id": "$roverId", "command": "${command.value}" }"""
    }
    // Use these functions to create commands
    fun takePicture(): String = createCommand(Command.TAKE_PICTURE)
    fun startStream(): String = createCommand(Command.START_STREAM)
    fun stopStream(): String = createCommand(Command.STOP_STREAM)
    fun tankTurn(): String = createCommand(Command.TANK_TURN)
    fun ping(): String = createCommand(Command.PING)
    fun startHeadlights(): String = createCommand(Command.START_HEADLIGHTS)
    fun closeHeadlights(): String = createCommand(Command.CLOSE_HEADLIGHTS)

    private enum class Command(val value: String) {
        // Used enums to prevent errors caused by typos or inconsistent string
        TAKE_PICTURE("PIC"),
        START_STREAM("STREAM"),
        STOP_STREAM("END-STREAM"),
        TANK_TURN("TANKTURN"),
        PING("ping"),
        START_HEADLIGHTS("HEADLIGHT_ON"),
        CLOSE_HEADLIGHTS("HEADLIGHT_OFF")
    }
}