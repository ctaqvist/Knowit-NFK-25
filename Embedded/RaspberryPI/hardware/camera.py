import subprocess
import base64
import os
from datetime import datetime

PICTURE_DIR = "./pictures"

def take_picture(time=2000, width=1920, height=1080):
    """
    Takes a still image using the Raspberry Pi camera and saves it to 'pictures/'
    with a unique timestamped filename. Returns the full filepath.
    """
    os.makedirs(PICTURE_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(PICTURE_DIR, f"image_{timestamp}.jpg")

    command = (
        f'libcamera-still -t {time} --width {width} --height {height} '
        f'-o {filepath}'
    )
    subprocess.run(command, shell=True)
    print(f"Image saved to: {filepath}")
    return filepath

def get_picture_base64(filepath):
    """
    Reads the image and returns a base64 string. Used to send over WebSocket.
    """
    if not os.path.exists(filepath):
        print("Image not found. Check the path.")
        return None

    with open(filepath, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")
