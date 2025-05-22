import json
from communication.serial_helper import arduino

# Forward joystick data to the Arduino
async def forward_joystick_to_arduino(steer_data):
    try:
        x = steer_data["x"]
        y = steer_data["y"]

        # Validate that x and y are not None before conversion
        if x is None or y is None:
            raise ValueError("None is not a valid coordinate")

        x = float(x)
        y = float(y)

    except (KeyError, ValueError, TypeError):
        return  # Skip sending if data is invalid

    await arduino.send(json.dumps({
        "command": "steer",
        "x": round(x, 2),
        "y": round(y, 2)
    }))

    await arduino.read_received_data()
