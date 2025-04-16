import asyncio
import websockets

async def main():
    uri = "wss://terrax9.se"
    async with websockets.connect(uri) as websocket:
        print("Ansluten som testklient")

        while True:
            msg = input("Skicka JSON (t.ex. {\"command\": \"fwd\"}): ")
            await websocket.send(msg)

            response = await websocket.recv()
            print(f"Svar: {response}")

asyncio.run(main())