import json
from communication.serial_helper import arduino
from config.settings import ROVER_ID, LOCAL_TEST

async def handle_light_command(command: str, websocket):
    # 1) skicka till Arduino
    await arduino.send(json.dumps({"command": command}))

    # 2) skicka bekräftelse till servern
    if command == "LIGHTS_ON":
        response_text = "Light turned ON"
    elif command == "LIGHTS_OFF":
        response_text = "Light turned OFF"
    else:
        response_text = f"Command sent: {command}"

    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "response": response_text
    }))
