import json
import os
from config.settings import ROVER_ID

async def handle_battery_level(value: float, websocket):
    payload = {
        "type": "battery_level",
        "rover_id": ROVER_ID,
        "value": round(value, 2)
    }
    await websocket.send(json.dumps(payload))


async def handle_low_battery_warning(flag: bool, websocket):
    payload = {
        "type": "low_battery_warning",
        "rover_id": ROVER_ID,
        "value": flag
    }
    await websocket.send(json.dumps(payload))


async def handle_sleep_mode(flag: bool, websocket):
    payload = {
        "type": "sleep_mode",
        "rover_id": ROVER_ID,
        "value": flag
    }
    await websocket.send(json.dumps(payload))

    if flag:
        # ge WebSocket en chans att dränera utgående buffer
        await websocket.drain()
        os.system("sudo shutdown now")