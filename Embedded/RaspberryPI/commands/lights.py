import json
from communication.serial_helper import arduino
from config.settings import ROVER_ID

# This function handles light-related commands sent to the rover.
# It receives commands over a WebSocket and sends the appropriate instructions to the Arduino.
async def handle_light_command(command, websocket):
    # Default to sending the command directly
    serial_command = command
    websocket_response = {
        "rover_id": ROVER_ID,
        "response": f"Command sent: {command}"
    }

    if command == "light_on":
        serial_command = json.dumps({
            "command": "light",
            "value": "on"
        })
        websocket_response["response"] = "Light turned ON"

    elif command == "light_off":
        serial_command = json.dumps({
            "command": "light",
            "value": "off"
        })
        websocket_response["response"] = "Light turned OFF"

    # Send to Arduino and return response via WebSocket
    arduino.send(serial_command)
    await websocket.send(json.dumps(websocket_response))


