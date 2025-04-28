from ..camera.picture import *
from ..camera.stream import *
from .lights import *
from .forwarder import *

async def process_command(websocket, command, params):
    # 1) steering always goes to the Arduino

    if "steer" in params:
        await forward_joystick_to_arduino(params["steer"])
        return

    # 2) PIC, START_STREAM, STOP_STREAM  → websocket
    if command in ("PIC", "START_STREAM", "STOP_STREAM"):
        await forward_joystick_to_arduino(websocket)
        return

    # 3) light_on / light_off → (cmd, websocket)
    if command in ("light_on", "light_off"):
        await forward_joystick_to_arduino(command, websocket)
        return

    # 4) nothing else
    print("No command or steer data found")
