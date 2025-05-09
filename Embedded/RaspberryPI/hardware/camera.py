# RaspberryPI/hardware/camera.py

from datetime import datetime
import os
import base64
from hardware.camera_instance import get_camera_instance

PICTURE_DIR = "./pictures"

def take_picture():
    picam2 = get_camera_instance()

    os.makedirs(PICTURE_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(PICTURE_DIR, f"image_{timestamp}.jpg")

    picam2.start()
    picam2.capture_file(filepath)
    return filepath

def get_picture_base64(filepath):
    if not os.path.exists(filepath):
        print("Image not found.")
        return None

    with open(filepath, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")
