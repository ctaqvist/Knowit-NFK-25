# RaspberryPI/main.py
import asyncio
import logging
from communication.websocket_rover import listen_to_server
from communication.serial_helper import arduino
import sys


sys.path.append('/home/joakim/Desktop/Rama/Knowit-NFK-25/Embedded')


# logging to a file
logging.basicConfig(
    filename='/home/joakim/rover.log',
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s'
)

def run():
    logging.debug("=== Rover system starting ===")
    print("[MAIN] Connecting to Arduino and starting WebSocket listener...")

    try:
        arduino.connect()
        logging.debug("Arduino connected.")
        
        asyncio.run(listen_to_server())
        logging.debug("WebSocket server started.")
        
    except Exception as e:
        logging.exception("Fatal error in main.run()")

if __name__ == "__main__":
    run()
