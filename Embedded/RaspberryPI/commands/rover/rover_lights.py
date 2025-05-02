import json
from communication.serial_helper import arduino
from config.settings import ROVER_ID, LOCAL_TEST

async def handle_light_command(command, websocket):
    # Default to sending the raw command string
    websocket_response = {
        "rover_id": ROVER_ID,
        "response": f"Command sent: {command}"
    }
    serial_command = json.dumps({ "command": command })
    await arduino.send(serial_command)
    if LOCAL_TEST == False:
        # Skicka svar tillbaka till klienten
        await websocket.send(json.dumps(websocket_response))