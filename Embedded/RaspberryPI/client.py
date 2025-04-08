import asyncio
import websockets
import json
import threading  
from serial_helper import connect_to_arduino, send_to_arduino
from camera import take_picture, get_picture_base64
from stream import start_video_stream

arduino = connect_to_arduino()
ROVER_ID = "rover-001"

async def listen_to_server():
    uri = "ws://test.lazyloops.se:8080"
    async with websockets.connect(uri) as websocket:
        print("Connected to server")

        await websocket.send(json.dumps({
            "type": "register",
            "rover_id": ROVER_ID
        }))

        while True:
            message = await websocket.recv()
            print(f"Message from server: {message}")

            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                print("Invalid JSON received – skipping...")
                continue

            command = data.get("command")
            params = data.get("params", {})

            if command is None:
                print("No command found – skipping message.")
                continue

            print(f"Incoming command: {command}")

            if command == "PIC":
                filepath = take_picture()
                image_b64 = get_picture_base64(filepath)

                if image_b64:
                    await websocket.send(json.dumps({
                        "rover_id": ROVER_ID,
                        "response": "picture_data",
                        "image_base64": image_b64
                    }))

            elif command == "STREAM":
                await websocket.send(json.dumps({
                    "rover_id": ROVER_ID,
                    "response": "Starting video stream in background..."
                }))
                
                stream_thread = threading.Thread(target=start_video_stream, daemon=True)
                stream_thread.start()

            elif command == "set_speed" and "value" in params:
                try:
                    value = float(params["value"])
                    cmd_obj = {
                        "command": "set_speed",
                        "value": value
                    }
                    send_to_arduino(arduino, json.dumps(cmd_obj))

                    await websocket.send(json.dumps({
                        "rover_id": ROVER_ID,
                        "response": f"Sent float: {value}"
                    }))
                except ValueError:
                    await websocket.send(json.dumps({
                        "rover_id": ROVER_ID,
                        "response": "Invalid float value"
                    }))
            else:
                serial_msg = command
                if "duration" in params:
                    serial_msg += f",{params['duration']}"

                send_to_arduino(arduino, serial_msg)

                await websocket.send(json.dumps({
                    "rover_id": ROVER_ID,
                    "response": f"Sent: {serial_msg}"
                }))

# Starta klienten
asyncio.run(listen_to_server())
