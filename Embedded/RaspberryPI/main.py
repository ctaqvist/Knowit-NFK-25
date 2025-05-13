import sys
import os
import logging
import asyncio
from config.settings import IS_RPI

if IS_RPI:
    import Robotic_arm.servo_module.functions as servo_module

from communication.websocket_communication import listen_to_server
from communication.serial_helper import arduino

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(PROJECT_ROOT)
HOME = os.path.expanduser("~")
LOG_FILE = os.path.join(HOME, "rover.log")

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)

logging.debug("=== Rover system is starting up ===")

def run():
    logging.debug("Running main() function")

    if IS_RPI:
        servo_module.setup_pins()

    arduino.connect()
    logging.debug("Arduino connected.")

    loop = asyncio.get_event_loop()
    tasks = [
        loop.create_task(listen_to_server())
    ]
    loop.run_until_complete(asyncio.wait(tasks))

    logging.debug("WebSocket server started.")

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        logging.exception("Exception occurred during import or run")
