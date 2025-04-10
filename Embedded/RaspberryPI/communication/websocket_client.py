import json
import websockets
from config.settings import ROVER_ID, SERVER_URI
from commands.handler import process_command
from communication.serial_helper import connect_to_arduino

arduino = connect_to_arduino()

async def listen_to_server():
    async with websockets.connect(SERVER_URI) as websocket:
        print("Connected to server")
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

            command = data.get("command")
            params = data 
            
            if command is None:
                print("No command found – skipping message.")
                continue

            await process_command(websocket, command, params, arduino)
#hej