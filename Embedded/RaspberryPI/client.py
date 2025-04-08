import asyncio
import websockets
import json
from serial_helper import connect_to_arduino, send_to_arduino
from camera import take_picture, get_picture_base64

# Connect to Arduino
arduino = connect_to_arduino()
ROVER_ID = "rover-001"

async def listen_to_server():
    uri = "ws://test.lazyloops.se:8080"  # Stockholm server
    async with websockets.connect(uri) as websocket:
        print("Connected to server")

        # Register the rover on the server
        await websocket.send(json.dumps({
            "type": "register",
            "rover_id": ROVER_ID
        }))

        while True:
            message = await websocket.recv()
            print(f"Message from server: {message}")

            # Try to parse the JSON message
            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                print("Invalid JSON received – skipping...")
                continue

            # Get command and params
            command = data.get("command")
            params = data.get("params", {})

            if command is None:
                print("No command found – skipping message.")
                continue

            print(f"Incoming command: {command}")

            # Handle camera command
            if command == "PIC":
                filepath = take_picture()
                image_b64 = get_picture_base64(filepath)

                if image_b64:
                    await websocket.send(json.dumps({
                        "rover_id": ROVER_ID,
                        "response": "picture_data",
                        "image_base64": image_b64
                    }))

            # Handle motor/serial commands
            else:
                serial_msg = command
                if "duration" in params:
                    serial_msg += f",{params['duration']}"

                send_to_arduino(arduino, serial_msg)

                await websocket.send(json.dumps({
                    "rover_id": ROVER_ID,
                    "response": f"Sent: {serial_msg}"
                }))

# Run the async WebSocket loop
asyncio.run(listen_to_server())
