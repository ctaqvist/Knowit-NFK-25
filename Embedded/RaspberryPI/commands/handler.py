from .camera.picture import *
from .camera.stream import *
from .lights import *
from commands.forwarder import *

# This function processes incoming commands sent over a WebSocket connection.
async def process_command(websocket, command, params, arduino):
    print("[DEBUG] Params received:", params)

    if "steer" in params:
        print("[DEBUG] Steering data found – forwarding to Arduino")
        await forward_joystick_to_arduino(params["steer"], arduino)
        return

    # Then handle normal command types
    if command == "PIC":
        await handle_pic_command(websocket)
    elif command == "START_STREAM":
        await handle_stream_command(websocket)
    elif command == "STOP_STREAM":
        await handle_stop_stream_command(websocket)
    elif command:
        await handle_movement(command, params, websocket, arduino)
    else:
        print("No command or steer data found – skipping message.")