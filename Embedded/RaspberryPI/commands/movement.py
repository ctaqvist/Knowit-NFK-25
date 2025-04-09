# commands/movement.py
import json
from communication.serial_helper import send_to_arduino
from config.settings import ROVER_ID

async def handle_movement(command, params, websocket, arduino):
    if command == "set_speed":
        try:
            value = float(params.get("value", 0))
            serial_command = json.dumps({
                "command": "set_speed",
                "value": value
            })
            send_to_arduino(arduino, serial_command)
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "response": f"Set speed: {value}"
            }))
        except ValueError:
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "response": "Invalid speed value"
            }))

    elif command == "navigate":
        try:
            angle = float(params.get("angle", 0.0))
            speed = int(params.get("speed", 0))
            forward = bool(params.get("forward", True))

            serial_command = json.dumps({
                "command": "navigate",
                "angle": angle,
                "speed": speed,
                "forward": forward
            })
            send_to_arduino(arduino, serial_command)
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "response": f"Navigating with angle={angle}, speed={speed}, forward={forward}"
            }))
        except (ValueError, TypeError):
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "response": "Invalid parameters for navigate"
            }))

    else:
        send_to_arduino(arduino, command)
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "response": f"Command sent: {command}"
        }))