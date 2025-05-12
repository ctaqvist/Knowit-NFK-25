import json
from ..camera.picture import handle_pic_command
from ..camera.stream import handle_stream_command, handle_stop_stream_command
from .rover_lights import handle_light_command
from .rover_forwarder import forward_joystick_to_arduino
from config.settings import IS_RPI, ROVER_ID
from commands.arm.arm_forwarder import forward_arm, forward_claw
from commands.rover.battery_handlers import (
    handle_battery_level,
    handle_low_battery_warning,
    handle_sleep_mode
)
if IS_RPI:  # RaspberryPI/commands/rover/handler.py
    from .handler import process_command

async def process_command(websocket, data, args):
    """
    Tar emot JSON-data från antingen server_reader eller serial_reader
    och dispatchar till rätt handler.
    """
    # Kolla om det är ett batterimeddelande
    cmd_type = data.get("type")
    if cmd_type == "battery_level":
        value = float(data.get("value", 0.0))
        await handle_battery_level(value, websocket)
        return

    if cmd_type == "low_battery_warning":
        flag = bool(data.get("value", False))
        await handle_low_battery_warning(flag, websocket)
        return

    if cmd_type == "sleep_mode":
        flag = bool(data.get("value", False))
        await handle_sleep_mode(flag, websocket)
        return

    # Joystick-styrning (steer + arm + claw)
    if "steer" in data:
        await forward_joystick_to_arduino(data["steer"])
        return

    if "steer_arm" in data and IS_RPI:
        await forward_arm(data["steer_arm"], websocket)
        return

    if "claw_data" in data and IS_RPI:
        await forward_claw(data["claw_data"], websocket)
        return

    # Övriga kommandon via "command"-fältet
    command = data.get("command")
    if command is None:
        # Inget igenkänt fält – skicka fel till servern
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": "No command or type field in data"
        }))
        return

    # Hantera enskilda kommandon
    if command == "PIC":
        await handle_pic_command(websocket)
    elif command == "START_STREAM":
        await handle_stream_command(websocket)
    elif command == "STOP_STREAM":
        await handle_stop_stream_command(websocket)
    elif command in ("LIGHTS_ON", "LIGHTS_OFF"):
        await handle_light_command(command, websocket)
    else:
        # Okänt kommando
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": f"Unsupported command: {command}"
        }))