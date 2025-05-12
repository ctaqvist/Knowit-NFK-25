import os
import asyncio
import json
import websockets
from config.settings import *
from config.settings import ROVER_ID, SERVER_URL, LOCAL_TEST
from commands.rover.handler import process_command
from communication.serial_helper import arduino

RECONNECT_DELAY = 5  # sekunder

# Skapa köer för olika meddelandetyper
steer_queue: asyncio.Queue
battery_queue: asyncio.Queue
light_queue: asyncio.Queue
sleep_queue: asyncio.Queue

async def steer_consumer(websocket: websockets.WebSocketClientProtocol):
    """Konsumerar steer-kommandon, droppar gamla och skickar senaste vidare."""
    while True:
        data = await steer_queue.get()
        while not steer_queue.empty():
            data = steer_queue.get_nowait()
        print(f"PROCESSING STEER: {data}")
        await process_command(websocket, data)

async def battery_consumer(websocket: websockets.WebSocketClientProtocol):
    """Konsumerar batterinivå-meddelanden och skickar dem via handler."""
    while True:
        level = await battery_queue.get()
        msg = {"type": "battery_level", "rover_id": ROVER_ID, "value": round(level, 2)}
        print(f"[BATTERY_LEVEL] → {msg}")
        await websocket.send(json.dumps(msg))

async def light_consumer(websocket: websockets.WebSocketClientProtocol):
    """Konsumerar varningar (Warning_signal) och skickar dem via handler."""
    while True:
        flag = await light_queue.get()
        msg = {"type": "low_battery_warning", "rover_id": ROVER_ID, "value": bool(flag)}
        print(f"[LOW_BATTERY_WARNING] → {msg}")
        await websocket.send(json.dumps(msg))

async def sleep_consumer(websocket: websockets.WebSocketClientProtocol):
    """Konsumerar sleep-mode och stänger av Pi om flag=True."""
    while True:
        flag = await sleep_queue.get()
        msg = {"type": "sleep_mode", "rover_id": ROVER_ID, "value": bool(flag)}
        print(f"[SLEEP_MODE] → {msg}")
        await websocket.send(json.dumps(msg))
        if flag:
            await asyncio.sleep(0.1)
            print("[SYSTEM] Raspberry Pi going to sleep mode → shutdown")
            os.system("sudo shutdown now")

async def server_reader(websocket: websockets.WebSocketClientProtocol):
    """Tar emot server-kommandon och dispatchar dem via kö eller direkt."""
    while True:
        raw = await websocket.recv()
        data = json.loads(raw)

        if "steer" in data:
            if steer_queue.full():
                _ = steer_queue.get_nowait()
            steer_queue.put_nowait(data)
        else:
            print(f"FORCEFUL COMMAND: {data}")
            await process_command(websocket, data)

async def handle_serial_message(data, websocket):
    """
    Tar emot dict från Arduino; pushar värden till rätt kö.
    """
    if "Battery_level" in data:
        battery_queue.put_nowait(data["Battery_level"])
    if "Warning_signal" in data:
        light_queue.put_nowait(data["Warning_signal"])
    if "Sleep_mode" in data:
        sleep_queue.put_nowait(data["Sleep_mode"])

async def serial_reader(websocket: websockets.WebSocketClientProtocol):
    """Läser från Arduino-kön och dispatchar rådata till handler."""
    queue = arduino.loop_queue
    while True:
        raw = await queue.get()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        await handle_serial_message(data, websocket)

async def listen_to_server():
    """Huvudloop: setup, initiera köer och starta alla consumers och readers."""
    # Initiera serial-queue
    arduino.loop_queue = asyncio.Queue()
    arduino.set_loop_queue(arduino.loop_queue)

    # Initiera övriga köer
    global steer_queue, battery_queue, light_queue, sleep_queue
    steer_queue   = asyncio.Queue(maxsize=1)
    battery_queue = asyncio.Queue()
    light_queue   = asyncio.Queue()
    sleep_queue   = asyncio.Queue()

    while True:
        try:
            async with websockets.connect(SERVER_URL) as websocket:
                print("Connected to server")

                # Registrera
                await websocket.send(json.dumps({"type": "register", "rover_id": ROVER_ID}))

                # Kör parallellt
                await asyncio.gather(
                    server_reader(websocket),
                    serial_reader(websocket),
                    steer_consumer(websocket),
                    battery_consumer(websocket),
                    light_consumer(websocket),
                    sleep_consumer(websocket),
                )

        except (OSError, websockets.WebSocketException) as e:
            print(f"[ERROR] Could not connect: {e}")
            print(f"[RETRYING] in {RECONNECT_DELAY}s…")
            await asyncio.sleep(RECONNECT_DELAY)

if __name__ == "__main__":
    if not LOCAL_TEST:
        asyncio.run(listen_to_server())
    else:
        # Lokal test-loop som tidigare
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