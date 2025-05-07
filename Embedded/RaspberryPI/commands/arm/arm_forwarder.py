import json
from config.settings import ROVER_ID
from Robotic_arm.servo_module.functions import move_arm, move_claw

async def forward_arm(arm_data, websocket):
    message = None
    try:
        x = float(arm_data.get("x", None))
        y = float(arm_data.get("y", None))
    except (TypeError, ValueError) as e:
        message =  {"rover_id": ROVER_ID, "status": "error", "message": f"Invalid x/y values: {e}"}
    
    if message == None:
        try:
            move_arm(x, y)
            message = {"rover_id": ROVER_ID, "status": "ok", "x": x, "y": y, "response": "Arm moved"}
        except Exception as e:
            message =  {"rover_id": ROVER_ID, "status": "error", "message": f"[forward_arm] {e}"}

    await websocket.send(json.dumps(message))

async def forward_claw(claw_data, websocket):
    message = None
    try:
        claw = float(claw_data.get("claw", None))
    except (TypeError, ValueError) as e:
        message = {"rover_id": ROVER_ID, "status": "error", "message": f"Invalid claw value: {e}"}
    
    if message is None:
        try:
            move_claw(claw)
            message = {"rover_id": ROVER_ID, "status": "ok", "claw": claw, "response": "Claw moved"}
        except Exception as e:
            message = {"rover_id": ROVER_ID, "status": "error", "message": f"[forward_claw] {e}"}

    await websocket.send(json.dumps(message))