import asyncio
import websockets
import time
import json
import base64
from datetime import datetime

URI = "ws://localhost:8080"

# Used to get messages from terminal

async def send_messages(websocket):
    while True:
        message = await asyncio.get_event_loop().run_in_executor(None, input, "> ")
        await websocket.send(message)

async def receive_messages(websocket):
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if (
                    data.get("sender") == "[CLIENT]" and
                    data.get("rover_id") == "rover-001" and
                    data.get("response") == "picture_data" and
                    "image_base64" in data
                ):
                    print("Just got image")
                    image_data = base64.b64decode(data["image_base64"])
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"received_image_{timestamp}.png"

                    with open(filename, "wb") as f:
                        f.write(image_data)

                    print(f"\nImage saved as {filename}")
                else:
                    print(f"\nReceived (non-image): {message}")
            except json.JSONDecodeError:
                print(f"\nReceived (non-JSON): {message}")

    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")

async def main():
    uri = "ws://localhost:9000?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3NDUzOTg2NjgsImV4cCI6MTc0NTQyMDI2OH0.1OMrTu_A5wzxQk6iJdt88pwtLVLGfauAyyRYrwgsqZA"
    async with websockets.connect(uri) as websocket:
        print("Connected to server")

        await asyncio.gather(
            send_messages(websocket),
            receive_messages(websocket)
        )

asyncio.run(main())