import json
from communication.serial_helper import arduino
import os

# Hantera inkommande sleep-kommandon från Arduino
async def handle_incoming_sleep_command(trigger: bool, websocket):
    data = {
        "type": "sleep_mode",
        "value": trigger
    }
    await websocket.send(json.dumps(data))

    if trigger:
        print("[Sleep] Trigger received from Arduino – shutting down...")
        os.system("sudo shutdown now")
    else:
        print("[Sleep] Battery OK – no shutdown.")

# 1. Skicka floatvärde för batterinivå
def send_battery_level(level: float):
    message = json.dumps({
        "command": "BATTERY_LEVEL",
        "level": round(level, 2)
    })
    arduino.send(message)
    arduino.read_ack()

# 2. Skicka och trigga sleepmode
def send_sleep_mode(trigger: bool):
    message = json.dumps({
        "command": "SLEEP_MODE",
        "trigger": trigger
    })
    arduino.send(message)
    arduino.read_ack()

# 3. Skicka låg batterivarning till Arduino
def send_low_battery_warning(trigger: bool):
    message = json.dumps({
        "command": "LOW_BATTERY_WARNING",
        "trigger": trigger
    })
    arduino.send(message)
    arduino.read_ack()
