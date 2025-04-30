import asyncio
import json
import websockets
from config.settings import ROVER_ID, SERVER_URI
from commands.arm.handler import process_command as arm_command_handler
from commands.rover.handler import process_command as rover_command_handler

# Main async function that connects to the WebSocket server
# and listens for commands directed to either the rover or the robot arm.

RECONNECT_DELAY = 5  # sekunder

async def listen_to_server():
    while True:
        try:
            async with websockets.connect(SERVER_URI) as websocket:
                print("Connected to server")

                registration = await websocket.recv()
                print(f"[REGISTRATION] {registration}") 
                
                try:
                    reg_data = json.loads(registration)
                    mode = reg_data.get("mode", "rover").lower()
                except json.JSONDecodeError as e:
                    print(f"[ERROR] Failed to decode registration JSON: {e}")
                    mode = "rover"

                active_handler = arm_command_handler if mode == "arm" else rover_command_handler    
                
                await websocket.send(json.dumps({
                    "type": "register",
                    "rover_id": ROVER_ID,
                    "mode": mode
                }))
                
                print(f"[INFO] Listening in '{mode}' mode")
                
                while True:
                    try:
                        message = await websocket.recv()
                        print(f"[RAW] {message}") 
                        data = json.loads(message)
                        command = data.get("command")
                        params = data

                        if command is None:
                            print("[ERROR] No command found in the message")
                            continue

                        await active_handler(websocket, command, params)

                    except json.JSONDecodeError as e:
                        print(f"[ERROR] Invalid JSON received: {e}")
                    except websockets.ConnectionClosed as e:
                        print(f"[DISCONNECTED] WebSocket closed: {e}")
                        break  # try to reconnect

        except (OSError, websockets.WebSocketException) as e:
            print(f"[ERROR] Could not connect to server: {e}")
            print(f"[RETRYING] Trying to reconnect in {RECONNECT_DELAY} seconds...")
            await asyncio.sleep(RECONNECT_DELAY)
