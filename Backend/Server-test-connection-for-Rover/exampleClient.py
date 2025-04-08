import asyncio
import websockets

URI = "ws://test.lazyloops.se"

# Used to get messages from terminal
async def send_messages(websocket):
    while True:
        message = await asyncio.get_event_loop().run_in_executor(None, input, "")      
        await websocket.send(message)

# Used to get message
async def receive_messages(websocket):
    try:
        async for message in websocket:
            print(f"\n       RECEIVED: {message}")
    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")

async def main():
    uri = URI
    async with websockets.connect(uri) as websocket:
        print("Connected to server")

        await asyncio.gather(
            send_messages(websocket),
            receive_messages(websocket)
        )

asyncio.run(main())