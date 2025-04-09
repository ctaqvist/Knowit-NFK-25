import serial
import time

def connect_to_arduino(port='/dev/ttyACM0', baudrate=9600):
    arduino = serial.Serial(port, baudrate)
    time.sleep(2)  # wait for connection to establish
    return arduino

def send_to_arduino(arduino, message):
    if not message or not isinstance(message, str):
        print(f"Invalid message – skipping send: {message}")
        return
    arduino.write((message + '\n').encode())
