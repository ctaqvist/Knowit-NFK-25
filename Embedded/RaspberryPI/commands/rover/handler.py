from ..camera.picture import *
from ..camera.stream import *
from .lights import *
from .forwarder import *
from .battery import send_battery_level, send_sleep_mode, send_low_battery_warning

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
    
    elif command == "BATTERY_LEVEL" and "value" in params:
        await send_battery_level(params["value"], websocket)
        return

    elif command == "SLEEP_MODE":
        trigger = params.get("trigger", False)
        await handle_incoming_sleep_command(trigger, websocket)
        return

    elif command == "LOW_BATTERY_WARNING" and "value" in params:
        await send_low_battery_warning(params["value"], websocket)
        return
    
    else :
        print(f"UNKNOWN COMMAND: {command}")
        return