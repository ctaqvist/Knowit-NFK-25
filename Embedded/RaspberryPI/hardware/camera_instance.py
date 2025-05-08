# RaspberryPI/hardware/camera_instance.py

from picamera2 import Picamera2

_picam2 = None

def get_camera_instance():
    global _picam2
    if _picam2 is None:
        _picam2 = Picamera2()
    return _picam2
