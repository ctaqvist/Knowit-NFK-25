import json
from config.settings import ROVER_ID

# Placeholder for actual arm movement logic
def move_arm_and_claw(x_angle: int, y_angle: int, claw_angle: int):
    print(f"[ARM] Move to X: {x_angle}, Y: {y_angle}, Claw: {claw_angle}")

# Convert joystick value to angle
def to_angle(value: float, claw=False) -> int:
    return int(value * 90) if claw else int((value - 0.5) * 180)

async def forward_arm(params, websocket):
    try:
        x = float(params.get("x", 0.5))
        y = float(params.get("y", 0.5))
        claw = float(params.get("claw", 0.0))

        x_angle = to_angle(x)
        y_angle = to_angle(y)
        claw_angle = to_angle(claw, claw=True)

        move_arm_and_claw(x_angle, y_angle, claw_angle)

        if websocket:
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "response": f"Moved arm to x:{x_angle}, y:{y_angle}, claw:{claw_angle}"
            }))
    except Exception as e:
        print(f"[ERROR] Invalid arm input: {e}")
        if websocket:
            await websocket.send(json.dumps({
                "rover_id": ROVER_ID,
                "response": "[ERROR] Invalid data for arm movement"
            }))