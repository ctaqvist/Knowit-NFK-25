# commands/rover/handler.py
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

async def process_command(websocket, data, args=None):
    """
    Dispatch incoming JSON data to the appropriate handler.
    Supports:
      - Battery and sleep via 'type' field
      - Joystick steer via 'steer' object
      - Arm and claw
      - Picture, stream, lights commands
    """
    # 1) Battery and sleep messages
    msg_type = data.get("type")
    if msg_type == "battery_level":
        value = float(data.get("value", 0.0))
        await handle_battery_level(value, websocket)
        return
    if msg_type == "low_battery_warning":
        flag = bool(data.get("value", False))
        await handle_low_battery_warning(flag, websocket)
        return
    if msg_type == "sleep_mode":
        flag = bool(data.get("value", False))
        await handle_sleep_mode(flag, websocket)
        return

    # 2) Joystick control
    if "steer" in data:
        await forward_joystick_to_arduino(data["steer"])
        return
    if "steer_arm" in data and IS_RPI:
        await forward_arm(data["steer_arm"], websocket)
        return
    if "claw_data" in data and IS_RPI:
        await forward_claw(data["claw_data"], websocket)
        return

    # 3) Other commands via 'command' field
    command = data.get("command")
    if command is None:
        # No recognizable field
        if websocket:
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "status": "error",
                "message": "No command or type field in data"
            }))
        return

    # Picture, stream, lights, etc.
    if command == "PIC":
        await handle_pic_command(websocket)
    elif command == "START_STREAM":
        await handle_stream_command(websocket)
    elif command == "STOP_STREAM":
        await handle_stop_stream_command(websocket)
    elif command in ("LIGHTS_ON", "LIGHTS_OFF"):
        await handle_light_command(command, websocket)
    else:
        # Unsupported command
        if websocket:
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "status": "error",
                "message": f"Unsupported command: {command}"
            }))