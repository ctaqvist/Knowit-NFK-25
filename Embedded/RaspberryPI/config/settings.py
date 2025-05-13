
ROVER_ID = "rover-001"
SERVER_URL = "wss://terrax9.se"
import platform

def is_raspberry_pi():
    try:
        with open("/proc/device-tree/model", "r") as f:
            model = f.read().lower()
            return "raspberry pi" in model
    except FileNotFoundError:
        return False

IS_RPI = is_raspberry_pi()
print(f"IS_RPI: {IS_RPI}")
LOCAL_TEST = False