import asyncio
import json
import websockets
from config.settings import ROVER_ID, SERVER_URL
from Embedded.RaspberryPI.commands.rover.handler import process_command

# Main async function that connects to the WebSocket server
# and listens for commands directed to either the rover or the robot arm.

RECONNECT_DELAY = 5  # sekunder

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

                        process_command(websocket, data)

                    except json.JSONDecodeError as e:
                        print(f"[ERROR] Invalid JSON received: {e}")
                    except websockets.ConnectionClosed as e:
                        print(f"[DISCONNECTED] WebSocket closed: {e}")
                        break  # try to reconnect

        except (OSError, websockets.WebSocketException) as e:
            print(f"[ERROR] Could not connect to server: {e}")
            print(f"[RETRYING] Trying to reconnect in {RECONNECT_DELAY} seconds...")
            await asyncio.sleep(RECONNECT_DELAY)
