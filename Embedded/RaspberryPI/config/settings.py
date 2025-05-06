
ROVER_ID = "rover-001"
SERVER_URL = "wss://terrax9.se"
import platform
#LOCAL_TEST = True

# Raspberry Pi brukar vara en ARM-board på Linux
IS_RPI= platform.system() == "Linux" and platform.machine().startswith("arm")
LOCAL_TEST = not IS_RPI