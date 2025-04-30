import asyncio
import json
import websockets
from config.settings import ROVER_ID, SERVER_URL
from Embedded.RaspberryPI.commands.rover.handler import process_command

RECONNECT_DELAY = 5

async def listen_to_server():
    while True:
        try:
            async with websockets.connect(SERVER_URL) as websocket:
                print("Connected to server")

                await websocket.send(json.dumps({
                    "type": "register",
                    "rover_id": ROVER_ID
                }))

                while True:
                    try:
                        message = await websocket.recv()
                        print(f"[RAW] {message}")

                        data = json.loads(message)
                        command = data.get("command")
                        params = data

                        if command is None:
                            print("No command found – skipping message.")
                            continue

                        await process_command(websocket, command, params)

                    except json.JSONDecodeError:
                        print("[ERROR] Invalid JSON")
                    except websockets.ConnectionClosed:
                        print("[DISCONNECTED] Server closed connection.")
                        break

        except Exception as e:
            print(f"[ERROR] Connection failed: {e}")
            print(f"[RETRYING] in {RECONNECT_DELAY} seconds...")
            await asyncio.sleep(RECONNECT_DELAY)
