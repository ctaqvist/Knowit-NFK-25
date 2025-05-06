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
    serial_command = json.dumps({ "command": command })
    if command == "LIGHTS_ON":
        websocket_response["response"] = "Light turned ON"

    elif command == "LIGHTS_OFF":
        websocket_response["response"] = "Light turned OFF"

    # Skicka kommandot till Arduino
    await arduino.send(serial_command)

    # Skicka svar tillbaka till klienten
    await websocket.send(json.dumps(websocket_response))