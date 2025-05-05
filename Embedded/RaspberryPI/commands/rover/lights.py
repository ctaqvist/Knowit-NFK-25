import json
from communication.serial_helper import arduino
from config.settings import ROVER_ID

async def handle_light_command(command, websocket):
    # Default to sending the raw command string
    websocket_response = {
        "rover_id": ROVER_ID,
        "response": f"Command sent: {command}"
    }

    # Match exact commands
    if command == "LIGHT_ON":
        serial_command = json.dumps({ "command": "LIGHT_ON" })
        websocket_response["response"] = "Light turned ON"

    elif command == "LIGHT_OFF":
        serial_command = json.dumps({ "command": "LIGHT_OFF" })
        websocket_response["response"] = "Light turned OFF"

    else:
        # Fallback if command is unknown
        serial_command = json.dumps({ "command": command })

    # Skicka kommandot till Arduino
    await arduino.send(serial_command)

    # Skicka svar tillbaka till klienten
    await websocket.send(json.dumps(websocket_response))