import asyncio
import json
import websockets
from config.settings import ROVER_ID, SERVER_URL, LOCAL_TEST
from commands.rover.handler import process_command

# Main async function that connects to the WebSocket server
# and listens for commands directed to either the rover or the robot arm.

if LOCAL_TEST:
    import readline
    OPTIONS = ["LIGHTS_ON", "LIGHTS_OFF", "STOP_STREAM", "START_STREAM", "PIC", "steer", "steer_arm", "claw_data"]

    def completer(text, state):
        matches = [option for option in OPTIONS if option.startswith(text)]
        return matches[state] if state < len(matches) else None

RECONNECT_DELAY = 5  # sekunder
if LOCAL_TEST == False:
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

                            await process_command(websocket, data)

                        except json.JSONDecodeError as e:
                            print(f"[ERROR] Invalid JSON received: {e}")
                        except websockets.ConnectionClosed as e:
                            print(f"[DISCONNECTED] WebSocket closed: {e}")
                            break  # try to reconnect

            except (OSError, websockets.WebSocketException) as e:
                print(f"[ERROR] Could not connect to server: {e}")
                print(f"[RETRYING] Trying to reconnect in {RECONNECT_DELAY} seconds...")
                await asyncio.sleep(RECONNECT_DELAY)
else:
    async def listen_to_server():
        websocket = 0
        params = {}
        readline.set_completer(completer)
        readline.parse_and_bind("tab: complete")

        while True:
            command = input("Enter command: ")
            if(command == "steer" or command == "steer_arm" or command == "claw_data"):
                x = input("x: ")
                y = input("y: ")
                params = {command:{"x":x,"y":y}}
            else:
                params = {"command": command}
            await process_command(websocket, params)