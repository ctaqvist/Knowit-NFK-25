import asyncio
import websockets

# Main asynchronous function that manages the WebSocket connection
async def main():
    uri = "ws://test.lazyloops.se"  # The WebSocket server URI

    # Connect to the server using the given URI
    async with websockets.connect(uri) as websocket:
        print("Connected as test client")

        while True:
            # Prompt the user to enter a message in JSON format
            msg = input("Send JSON (e.g. {\"command\": \"fwd\"}): ")

            # Send the message to the WebSocket server
            await websocket.send(msg)

            # Wait for and receive the response from the server
            response = await websocket.recv()
            
            # Print the server's response
            print(f"Response: {response}")

# Start the asynchronous event loop and run the main function
asyncio.run(main())
