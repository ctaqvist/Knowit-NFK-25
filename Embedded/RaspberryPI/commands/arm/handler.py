from commands.arm.forwarder import forward_arm, forward_claw
import json
from config.settings import ROVER_ID

# Handles commands specific to the robot arm
async def process_command(websocket, command, params):
    if "steer-arm" in params:
        await forward_arm(params["steer-arm"], websocket)
        return

    if "steer-claw" in params:
        await forward_claw(params["steer-claw"], websocket)
        return

    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "status": "error",
        "message": "[arm] Unsupported arm command"
    }))
