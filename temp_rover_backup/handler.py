from ..camera.picture import *
from ..camera.stream import *
from .lights import *
<<<<<<<< Updated upstream:Embedded/RaspberryPI/commands/rover/handler.py
from Embedded.RaspberryPI.commands.rover.forwarder import *
========
from RaspberryPI.commands.rover.forwarder import *
>>>>>>>> Stashed changes:temp_rover_backup/handler.py

# This function processes incoming commands sent over a WebSocket connection.
async def process_command(websocket, command, params):
    print("[DEBUG] Params received:", params)

    if "steer" in params:
        print("[DEBUG] Steering data found – forwarding to Arduino")
        await forward_joystick_to_arduino(params["steer"])
        return

    # Then handle normal command types
    if command == "PIC":
        await handle_pic_command(websocket)
    elif command == "START_STREAM":
        await handle_stream_command(websocket)
    elif command == "STOP_STREAM":
        await handle_stop_stream_command(websocket)
    elif command:
        await handle_light_command(command, websocket)
    else:
        print("No command or steer data found – skipping message.")