# Embedded/RaspberryPI/commands/rover/rover_forwarder.py
"""
Runda styrkommando och skicka som JSON över seriell till Arduino.
"""
import json
from communication.serial_helper import arduino

async def forward_joystick_to_arduino(data):
    """
    Tar emot dict med 'x' och 'y'. Runda till 2 decimala och skicka.
    """
    try:
        x = float(data.get("x"))
        y = float(data.get("y"))
    except (TypeError, ValueError):
        return

    x = round(x, 2)
    y = round(y, 2)
    payload = json.dumps({
        "command": "steer",
        "x": x,
        "y": y
    })
    arduino.send(payload)
