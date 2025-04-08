import subprocess
import base64
import os
from datetime import datetime

PICTURE_DIR = "./pictures"

def take_picture(time=2000, width=1920, height=1080):
    """
    Takes a still image using the Raspberry Pi camera and saves it to 'pictures/' with a unique timestamped filename.
    Returns the full filepath of the saved image.
    """
    os.makedirs(PICTURE_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(PICTURE_DIR, f"image_{timestamp}.jpg")

    command = (
        f'rpicam-still -t {time} --width {width} --height {height} '
        f'-o {filepath}'
    )
    subprocess.run(command, shell=True)
    print(f"Image saved to: {filepath}")
    return filepath 

def get_picture_base64(filepath):
    """
    Reads the image from the given filepath and returns a Base64-encoded string.
    This can be used to send the image over WebSocket in JSON format.
    """
    if not os.path.exists(filepath):
        print("Image not found – please check the path.")
        return None

    with open(filepath, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")

















# from picamera2 import Picamera2, Preview
# from datetime import datetime
# import time

# # Starta kameran
# picam2 = Picamera2()

# # Skapa en konfiguration för stillbild med upplösning 1920x1080
# config = picam2.create_still_configuration(main={"size": (1920, 1080)})

# picam2.configure(config)

# # Starta kameran
# picam2.start()

# # Ta bild och spara med dagens datum i filnamnet
# filename = f"image-{datetime.now().strftime('%Y-%m-%d')}.jpg"
# picam2.capture_file(filename)

# print(f"Bild sparad som: {filename}")




