import json
import time
from communication.serial_helper import arduino
from config.settings import ROVER_ID, LOCAL_TEST

async def handle_light_command(command: str, websocket):
    # 1) Skicka till Arduino med rover_id och timestamp
    payload = {
        "command": command,
        "rover_id": ROVER_ID,
        "ts": int(time.time() * 1000)
    }
    sent = await arduino.send(json.dumps(payload))
    if not sent:
        print(f"[ERROR] Could not send {command} to Arduino")

    # 2) Skicka bekräftelse till servern
    if command == "LIGHTS_ON":
        response_text = "Light turned ON"
    elif command == "LIGHTS_OFF":
        response_text = "Light turned OFF"
    else:
        response_text = f"Command sent: {command}"

    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "type": "light_response",
        "response": response_text
    }))
