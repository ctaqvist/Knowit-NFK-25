
import subprocess

def take_picture(time = 2000,width=1920, height=1080):
    

    command = (
        f'rpicam-still -t {time} --width {width} --height {height} '
        f'-o image-$(date +%Y-%m-%d_%H).jpg'
    )
    subprocess.run(command, shell=True)



















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




