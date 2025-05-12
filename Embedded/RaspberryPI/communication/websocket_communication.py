import os
import asyncio
import json
import websockets
from config.settings import *
from config.settings import ROVER_ID, SERVER_URL, LOCAL_TEST
from commands.rover.handler import process_command
from communication.serial_helper import arduino

RECONNECT_DELAY = 5  # sekunder
active_steer = False

async def _steer_runner(websocket, data):
    """Bakgrunds‐task för styrning så vi inte stoppar WS‐loopen."""
    global active_steer
    try:
        await process_command(websocket, data)
    finally:
        active_steer = False
        print("BACKGROUND STEER DONE.")

async def server_reader(websocket):
    """Tar emot server‐kommandon och dispatchar dem."""
    global active_steer
    while True:
        raw = await websocket.recv()
        data = json.loads(raw)

        if "steer" in data:
            if not active_steer:
                active_steer = True
                print(f"STARTING STEER: {data}")
                asyncio.create_task(_steer_runner(websocket, data))
            else:
                print("SKIPPING STEER: redan aktiv")
        else:
            print(f"FORCEFUL COMMAND: {data}")
            await process_command(websocket, data)

async def handle_serial_message(data, websocket):
    """
    Tar emot dict från Arduino med fälten:
      - Battery_level (float)
      - Warning_signal (bool)
      - Sleep_mode (bool)
    Skickar vidare varje värde som eget paket, och stänger Pi om Sleep_mode=True.
    """
    # 1) Batterinivå
    if "Battery_level" in data:
        msg = {
            "type": "battery_level",
            "rover_id": ROVER_ID,
            "value": data["Battery_level"]
        }
        print(f"[BATTERY_LEVEL] → {msg}")
        await websocket.send(json.dumps(msg))

    # 2) Low battery warning
    if "Warning_signal" in data:
        msg = {
            "type": "low_battery_warning",
            "rover_id": ROVER_ID,
            "value": data["Warning_signal"]
        }
        print(f"[LOW_BATTERY_WARNING] → {msg}")
        await websocket.send(json.dumps(msg))

    # 3) Sleep mode
    if "Sleep_mode" in data:
        msg = {
            "type": "sleep_mode",
            "rover_id": ROVER_ID,
            "value": data["Sleep_mode"]
        }
        print(f"[SLEEP_MODE] → {msg}")
        await websocket.send(json.dumps(msg))

        if data["Sleep_mode"]:
            # Säkerställ att meddelandet skickas innan shutdown
            await asyncio.sleep(0.1)
            print("[SYSTEM] Raspberry Pi going to sleep mode → shutdown")
            os.system("sudo shutdown now")

async def serial_reader(websocket):
    """Läser från Arduino-kön och skapar en egen task per inkommen rad."""
    queue = arduino.loop_queue
    while True:
        raw = await queue.get()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        # Dispatch varje rad i en egen task för asynkron hantering
        asyncio.create_task(handle_serial_message(data, websocket))

async def listen_to_server():
    """Huvudloop: connect, registrera, initiera queue och kör reader-tasks."""
    # Initiera kö för serial_reader
    arduino.loop_queue = asyncio.Queue()

    while True:
        try:
            async with websockets.connect(SERVER_URL) as websocket:
                print("Connected to server")

                # Registrera
                await websocket.send(json.dumps({
                    "type": "register",
                    "rover_id": ROVER_ID
                }))

                # Kör både server_reader och serial_reader parallellt
                await asyncio.gather(
                    server_reader(websocket),
                    serial_reader(websocket),
                )

        except (OSError, websockets.WebSocketException) as e:
            print(f"[ERROR] Could not connect: {e}")
            print(f"[RETRYING] in {RECONNECT_DELAY}s…")
            await asyncio.sleep(RECONNECT_DELAY)

if __name__ == "__main__":
    if not LOCAL_TEST:
        asyncio.run(listen_to_server())
    else:
        # Behåll er lokal-test-loop orörd
        import readline
        OPTIONS = ["LIGHTS_ON", "LIGHTS_OFF", "STOP_STREAM", "START_STREAM", "PIC", "steer", "steer_arm", "claw_data"]
        def completer(text, state):
            matches = [o for o in OPTIONS if o.startswith(text)]
            return matches[state] if state < len(matches) else None

        readline.set_completer(completer)
        readline.parse_and_bind("tab: complete")

        async def _local_test():
            while True:
                cmd = input("Enter command: ")
                if cmd in ("steer","steer_arm","claw_data"):
                    x = input("x: "); y = input("y: ")
                    params = {cmd: {"x": x, "y": y}}
                else:
                    params = {"command": cmd}
                await process_command(None, params)

        asyncio.run(_local_test())