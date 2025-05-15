import os
import asyncio
import json
import websockets
from config.settings import ROVER_ID, SERVER_URL, LOCAL_TEST
from commands.rover.handler import process_command
from communication.serial_helper import arduino

RECONNECT_DELAY = 5  # sekunder

# Initiera köer för olika meddelandetyper
global steer_queue, battery_queue, light_queue, sleep_queue
steer_queue: asyncio.Queue
battery_queue: asyncio.Queue
light_queue: asyncio.Queue
sleep_queue: asyncio.Queue

async def steer_consumer(websocket: websockets.WebSocketClientProtocol):
    """Plockar senaste steer-kommandot och skickar vidare."""
    while True:
        data = await steer_queue.get()
        # Droppa mellanliggande, behåll bara senast
        while not steer_queue.empty():
            data = steer_queue.get_nowait()
        print(f"PROCESSING STEER: {data}")
        await process_command(websocket, data)

async def battery_consumer(websocket: websockets.WebSocketClientProtocol):
    """Skickar batteri-status vidare till servern."""
    while True:
        level = await battery_queue.get()
        msg = {"type": "battery_level", "rover_id": ROVER_ID, "value": round(level, 2)}
        print(f"[BATTERY_LEVEL] → {msg}")
        await websocket.send(json.dumps(msg))

async def light_consumer(websocket: websockets.WebSocketClientProtocol):
    """Skickar låg-batteri-varning vidare till servern."""
    while True:
        flag = await light_queue.get()
        msg = {"type": "low_battery_warning", "rover_id": ROVER_ID, "value": bool(flag)}
        print(f"[LOW_BATTERY_WARNING] → {msg}")
        await websocket.send(json.dumps(msg))

async def sleep_consumer(websocket: websockets.WebSocketClientProtocol):
    """Hantera sleep-mode och stänger av vid flag=True."""
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
    """Läser inkommande websocket-meddelanden och dispatchar dem."""
    while True:
        raw = await websocket.recv()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            print(f"[ERROR] Ogiltig JSON: {raw}")
            continue
        if "steer" in data:
            # Puffra steer-kommandon, max 1 i kön
            if steer_queue.full():
                _ = steer_queue.get_nowait()
            steer_queue.put_nowait(data)
        else:
            print(f"FORCEFUL COMMAND: {data}")
            await process_command(websocket, data)

async def serial_reader(websocket: websockets.WebSocketClientProtocol):
    """Läser från Arduino-kön och dispatchar seriedata till köer."""
    queue = arduino.loop_queue
    while True:
        raw = await queue.get()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        # Skicka till respektive kö
        if "Battery_level" in data:
            battery_queue.put_nowait(data["Battery_level"])
        if "Warning_signal" in data:
            light_queue.put_nowait(data["Warning_signal"])
        if "Sleep_mode" in data:
            sleep_queue.put_nowait(data["Sleep_mode"])

async def listen_to_server():
    """Main loop: initiera köer, anslut WS, och kör alla readers och consumers."""
    # Initiera serial queue
    arduino.loop_queue = asyncio.Queue()
    arduino.set_loop_queue(arduino.loop_queue)

    # Initiera övriga köer
    global steer_queue, battery_queue, light_queue, sleep_queue
    steer_queue = asyncio.Queue(maxsize=1)
    battery_queue = asyncio.Queue()
    light_queue = asyncio.Queue()
    sleep_queue = asyncio.Queue()

    while True:
        try:
            async with websockets.connect(SERVER_URL) as websocket:
                print("Connected to server")
                # Registrera rover
                await websocket.send(json.dumps({"type": "register", "rover_id": ROVER_ID}))
                # Kör readers och consumers parallellt
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
            print(f"[RETRYING] in {RECONNECT_DELAY}s...")
            await asyncio.sleep(RECONNECT_DELAY)

# Lokal test-loop om vi kör utan WS-server
if __name__ == "__main__" and LOCAL_TEST:
    import readline
    OPTIONS = ["LIGHTS_ON", "LIGHTS_OFF", "STOP_STREAM", "START_STREAM", "PIC", "steer", "steer_arm", "claw_data"]
    readline.set_completer(lambda text, state: [o for o in OPTIONS if o.startswith(text)][state] if state < len(OPTIONS) else None)
    readline.parse_and_bind("tab: complete")

    asyncio.run(listen_to_server())
else:
    if not LOCAL_TEST:
        asyncio.run(listen_to_server())