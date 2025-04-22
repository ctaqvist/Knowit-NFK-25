import json
from communication.serial_helper import arduino

async def forward_joystick_to_arduino(steer_data):
    try:
        x = float(steer_data["x"])
        y = float(steer_data["y"])
    except (KeyError, ValueError):
        print("[ERROR] Invalid steer data:", steer_data)
        return

    # Pack joystick values in JSON and send to Arduino
    serial_command = json.dumps({
        "command": "steer",
        "x": round(x, 2),
        "y": round(y, 2)
    })

    arduino.send(serial_command)
    print(f"[SENDING TO ARDUINO]: {serial_command}")
