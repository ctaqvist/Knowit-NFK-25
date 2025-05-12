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

# These are two tasks for driving and steering arm
steer_drive_task: asyncio.Task | None = None
steer_arm_task: asyncio.Task | None = None

# Helper to run an async task "blocking"
async def _steer_runner(websocket, data):
    try:
        await process_command(websocket, data)
    except asyncio.CancelledError:
        print("Steer task was cancelled.")
        raise
    finally:
        print("BACKGROUND STEER DONE.")

# Helper to cancel a task and block until it is cancelled
async def cancelTask(task):
    print("Cancels tasks...")
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    print("Task cancels...")
        
if LOCAL_TEST == False:
    async def listen_to_server():
        global steer_drive_task
        global steer_arm_task
        
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
                            data = json.loads(message)

                            # If not a steer command, always process immediately and do it blocking
                            # NOTE: This could also be put in a async queue so steering won't stop working during normal commands
                            if "steer" not in message:
                                print(f"Forceful command: {message}")
                                #await process_command(websocket, data)
                                asyncio.create_task(process_command(websocket, data))
                                continue
                            
                            # If a steer command (drive)
                            if "steer" in message and "steer_arm" not in message:
                                # Cancel any ongoing steer (drive) job
                                if steer_drive_task is not None and not steer_drive_task.done():                                
                                    await cancelTask(steer_drive_task) 
                                
                                # Start new task
                                steer_drive_task = asyncio.create_task(_steer_runner(websocket, data))
                                continue
                                
                            # If a steer_arm command
                            if "steer_arm" in message:
                                # Cancel any ongoing steer (drive) job
                                if steer_arm_task is not None and not steer_arm_task.done():                                
                                    await cancelTask(steer_arm_task)   
                                
                                # Start new task
                                steer_arm_task = asyncio.create_task(_steer_runner(websocket, data))
                                continue
                            
                            print("FATAL ERROR: No command found")

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
            #await process_command(websocket, params)
            asyncio.create_task(process_command(websocket, params))