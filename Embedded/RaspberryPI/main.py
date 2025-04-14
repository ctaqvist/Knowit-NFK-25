import asyncio
from communication.websocket_client import *

if __name__ == "__main__":
    asyncio.run(listen_to_server())
