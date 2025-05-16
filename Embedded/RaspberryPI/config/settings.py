
ROVER_ID = "rover-001"
SERVER_URL = "ws://terrax9.se:8081?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3ZlcklkIjoxLCJyb3ZlclNlcmlhbCI6InJvdmVyLTAwMSIsImlhdCI6MTc0NjUxMzI2Mn0.7GJFXH6KjS3QPTchEq8eSwRE9oePc04jzHzNvh43eII"
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