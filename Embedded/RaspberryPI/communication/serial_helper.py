import serial
import json
import time

def connect_to_arduino(port='/dev/ttyACM1', baudrate=9600):
    try:
        arduino = serial.Serial(port, baudrate)
        time.sleep(2) 
        print(f"Connected to Arduino on {port} at {baudrate} baud")
        return arduino
    except serial.SerialException as e:
        print(f"Error connecting to Arduino: {e}")
        return None


def send_to_arduino(arduino, message):
  
    if not message or not isinstance(message, str):
        print(f"Invalid message – skipping send: {message}")
        return

    try:
        arduino.write((message + '\n').encode())  
        print(f"Sent to Arduino: {message}")

        time.sleep(0.05)  # liten fördröjning så Arduino hinner svara
        if arduino.in_waiting:
            response = arduino.readline().decode('utf-8').strip()
            print(f"[Arduino replied]: {response}")

    except serial.SerialException as e:
        print(f"Error sending message to Arduino: {e}")














