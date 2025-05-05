import sys
import os
import logging

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

try:
    import asyncio
    from communication.websocket_rover import listen_to_server
    from communication.serial_helper import arduino

    def run():
        logging.debug("Running main() function")
        arduino.connect()
        logging.debug("Arduino connected.")
        asyncio.run(listen_to_server())
        logging.debug("WebSocket server started.")
        
    if __name__ == "__main__":
        run()

except Exception as e:
    logging.exception("Exception occurred during import or run")