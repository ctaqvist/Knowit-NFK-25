from ..camera.picture import *
from ..camera.stream import *
from .rover_lights import *
from .rover_forwarder import *
from commands.arm.arm_forwarder import forward_arm, forward_claw

async def process_command(websocket, data):
    command = data.get("command")

    if "steer" in data:
        await forward_joystick_to_arduino(data["steer"])
        return
    elif "steer_arm" in data:
        await forward_arm(data["steer_arm"], websocket)
        return
    elif "steer_claw" in data:
        await forward_claw(data["steer_claw"], websocket)
        return

    if command == "PIC":
        take_picture() 
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
    else:
        print(f"UNKNOWN COMMAND: {command}")
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": "Unsupported command"
        }))
        return

