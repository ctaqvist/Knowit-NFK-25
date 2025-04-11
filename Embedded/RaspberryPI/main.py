import asyncio
from communication.websocket_client import listen_to_server

if __name__ == "__main__":
    asyncio.run(listen_to_server())
