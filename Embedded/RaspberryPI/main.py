# RaspberryPI/main.py
import asyncio
from communication.websocket_rover import listen_to_server
from communication.serial_helper import arduino

def run():
    print("[MAIN] Connecting to Arduino and starting WebSocket listener...")
    arduino.connect()
    asyncio.run(listen_to_server())

if __name__ == "__main__":
    run()
