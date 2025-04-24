import json
from RaspberryPI.config.settings import ROVER_ID
from RaspberryPI.Robotic_arm.servo_module.functions import move_arm, move_claw
from RaspberryPI.config.settings import ROVER_ID

# Forwards joystick x/y values to the robot arm
async def forward_arm(arm_data,websocket):
    try:
        x = float(arm_data["x"])
        y = float(arm_data["y"])
    except (KeyError, ValueError, TypeError):
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": "[steer_arm] Invalid x/y values"
        }))
        return

    move_arm(x, y)

    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "status": "ok",
        "response": "Arm moved",
        "x": x,
        "y": y
    }))

# Forwards joystick value to the robot claw
async def forward_claw(claw_data, websocket):
    try:
        claw = float(claw_data["claw"])
    except (KeyError, ValueError, TypeError):
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": "[steer_claw] Invalid claw value"

        }))
        return

    move_claw(claw)

    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "status": "ok",
        "response": "Claw moved",
        "claw": claw
    }))