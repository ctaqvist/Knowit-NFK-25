import json
import os

async def handle_battery_level(value: float, websocket):
    """
    Tar emot ett floatvärde (0.0–1.0) för batterinivån
    och vidarebefordrar detta till applikationen.
    """
    payload = {
        "type": "battery_level",
        "value": round(value, 2)
    }
    await websocket.send(json.dumps(payload))


async def handle_low_battery_warning(flag: bool, websocket):
    """
    Tar emot en Boolean som indikerar låg batterinivå
    (True = låg batterinivå). Vidarebefordrar till appen.
    """
    payload = {
        "type": "low_battery_warning",
        "value": flag
    }
    await websocket.send(json.dumps(payload))


async def handle_sleep_mode(flag: bool, websocket):
    """
    Tar emot en Boolean som indikerar sleep mode:
    True  = initiera nedstängning,
    False = avbryt sleep mode.
    Vidarebefordrar alltid till appen – och stänger sedan av Pi om flag=True.
    """
    payload = {
        "type": "sleep_mode",
        "value": flag
    }
    await websocket.send(json.dumps(payload))

    if flag:
        # ge websockets en kort stund att skicka iväg meddelandet
        await websocket.drain()
        os.system("sudo shutdown now")