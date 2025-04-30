import asyncio
from communication.websocket_rover import *
from communication.serial_helper import arduino

if __name__ == "__main__":
    arduino.connect()  # Connect to Arduino
    asyncio.run(listen_to_server())
