# camera_instance.py
from picamera2 import Picamera2

_picam2 = None

def get_camera_instance():
    global _picam2
    if _picam2 is None:
        _picam2 = Picamera2()
    return _picam2

def release_camera_instance():
    global _picam2
    if _picam2:
        print("[DEBUG] Releasing global camera instance.")
        _picam2.close()
        _picam2 = None
