import json
import websockets
from config.settings import ROVER_ID, SERVER_URI
from commands.handler import *
from commands.forwarder import *
from communication.serial_helper import *

# Connect to Arduino via serial
arduino = connect_to_arduino()

# Main async function to listen to server commands
async def listen_to_server():
    async with websockets.connect(SERVER_URI) as websocket:
        print("Connected to server")

        # Register the rover on the server
        await websocket.send(json.dumps({
            "type": "register",
            "rover_id": ROVER_ID
        }))

        while True:
            message = await websocket.recv()
            print(f"[RAW] {message}")

            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                print("Invalid JSON")
                continue

            #  Maintain joystick/steer-data
            if "steer" in data:
                await forward_joystick_to_arduino(data["steer"], arduino)
                continue  

            command = data.get("command")
            await process_command(websocket, command, data, arduino)
