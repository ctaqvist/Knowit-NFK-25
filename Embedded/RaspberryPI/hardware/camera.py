# RaspberryPI/hardware/camera.py

from datetime import datetime
import os
import base64
from hardware.camera_instance import get_camera_instance, release_camera_instance
from hardware.video_streamer import is_streaming, stop_video_stream, start_video_stream
from hardware.video_streamer import *

PICTURE_DIR = "./pictures"

def take_picture():
    was_streaming = False

    if is_streaming:
        print("[INFO] Stream is active. Pausing it to take snapshot...")
        stop_video_stream()
        wait_until_camera_free()
        was_streaming = True

    picam2 = get_camera_instance()

    os.makedirs(PICTURE_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(PICTURE_DIR, f"image_{timestamp}.jpg")

    picam2.start()
    picam2.capture_file(filepath)
    picam2.close()
    release_camera_instance()

    if was_streaming:
        print("[INFO] Resuming stream after snapshot...")
        time.sleep(0.5)
        wait_until_camera_free(timeout=3)
        start_video_stream()

    return filepath




def get_picture_base64(filepath):
    if not os.path.exists(filepath):
        print("Image not found.")
        return None

    with open(filepath, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")
