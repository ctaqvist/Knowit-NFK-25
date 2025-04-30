from ..camera.picture import *
from ..camera.stream import *
from .lights import *
from .forwarder import *

async def process_command(websocket, command, params):
    if "steer" in params:
        await forward_joystick_to_arduino(params["steer"])
        return

    if command == "PIC":
        take_picture(websocket) 
        return

    elif command == "START_STREAM":
        await handle_stream_command(websocket)
        return

    elif command == "STOP_STREAM":
        await handle_stop_stream_command(websocket)
        return

    elif command in ("LIGHT_ON", "LIGHT_OFF"):
        await handle_light_command(command, websocket)
        return
    else :
        print(f"UNKNOWN COMMAND: {command}")
        return

