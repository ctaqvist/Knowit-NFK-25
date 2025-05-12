import json
import time
from config.settings import ROVER_ID
from Robotic_arm.servo_module.functions import move_arm, move_claw
import time
last_arm_time = None


async def forward_arm(arm_data, websocket):
    # parse inputs
    try:
        shoulder = float(arm_data.get("shoulder", None))
        axis     = float(arm_data.get("axis",     None))
    except (TypeError, ValueError) as e:
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status":   "error",
            "message":  f"Invalid x/y values: {e}"
        }))
        return

    # compute dt
    global last_arm_time
    now = time.time()
    if last_arm_time is None:
        dt = 0.02
    else:
        dt = now - last_arm_time
    last_arm_time = now

    # DEBUG: print your inputs so you can see dt and joystick values
    print(f"[forward_arm] shoulder={shoulder:.2f}, axis={axis:.2f}, dt={dt:.4f}")

    # move the arm *once*, with speed control
    try:
        move_arm(shoulder, axis, dt)
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status":   "ok",
            "shoulder": shoulder,
            "axis":     axis,
            "dt":       round(dt, 4),
            "response": "Arm moved"
        }))
    except Exception as e:
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status":   "error",
            "message":  f"[forward_arm] {e}"
        }))

async def forward_claw(claw_data, websocket):
    try:
        claw = float(claw_data.get("claw", None))
    except (TypeError, ValueError) as e:
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": f"Invalid claw value: {e}"
        }))
        return

    try:
        move_claw(claw)
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "ok",
            "claw": claw,
            "response": "Claw moved"
        }))
    except Exception as e:
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "status": "error",
            "message": f"[forward_claw] {e}"
        }))
