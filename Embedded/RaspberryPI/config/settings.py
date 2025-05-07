
ROVER_ID = "rover-001"
SERVER_URL = "wss://terrax9.se"
import platform

# Raspberry Pi brukar vara en ARM-board på Linux
IS_RPI = platform.system() == "Linux" and platform.machine().startswith("arm")
LOCAL_TEST = True