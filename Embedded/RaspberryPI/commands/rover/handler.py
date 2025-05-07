from ..camera.picture import *
from ..camera.stream import *
from .rover_lights import *
from .rover_forwarder import *
from config.settings import IS_RPI
if IS_RPI:
    from commands.arm.arm_forwarder import forward_arm, forward_claw

async def process_command(websocket, data):
    command = data.get("command")
    print(f"Received data: {data}")
    print(f"Command: {command}")
    if "steer" in data:
        await forward_joystick_to_arduino(data["steer"])
        return
    elif "steer_arm" in data:
        if IS_RPI:
            await forward_arm(data["steer_arm"], websocket)
        return
    elif "claw_data" in data:
        if IS_RPI:
            await forward_claw(data["claw_data"], websocket)
        return

    if command is not None:
        if command == "PIC":
            take_picture() 
            return
        elif command == "START_STREAM":
            await handle_stream_command(websocket)
            return
        elif command == "STOP_STREAM":
            await handle_stop_stream_command(websocket)
            return
        elif command in ("LIGHTS_ON", "LIGHTS_OFF"):
            print(f"Received command: {command}")
            await handle_light_command(command, websocket)
            return
        else:
            print(f"UNKNOWN COMMAND: {command}")
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "status": "error",
                "message": "Unsupported command"
            }))
            return

