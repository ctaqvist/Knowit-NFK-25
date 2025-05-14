import json
from config.settings import ROVER_ID
import Robotic_arm.servo_module.functions as F

async def forward_arm(arm_data, websocket):
    try:
        shoulder = float(arm_data.get("shoulder", 0.0))
        axis     = float(arm_data.get("axis",     0.0))
        claw     = float(arm_data.get("claw",     0.0))
    except (TypeError, ValueError) as e:
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status":   "error",
            "message":  f"Invalid inputs: {e}"
        }))
        return

    F._input_shoulder = shoulder
    F._input_axis     = axis
    F._input_claw     = claw

    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "status":   "ok",
        "shoulder": shoulder,
        "axis":     axis,
        "claw":      claw,
        "response": "Inputs updated"
    }))