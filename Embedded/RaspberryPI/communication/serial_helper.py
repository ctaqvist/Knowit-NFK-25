import serial
import json
import time

# Connects to Arduino via serial
def connect_to_arduino(port='/dev/ttyACM0', baudrate=9600):
    try:
        arduino = serial.Serial(port, baudrate)
        time.sleep(2)  # Wait for connection to stabilize
        print(f"Connected to Arduino on {port} at {baudrate} baud")
        return arduino
    except serial.SerialException as e:
        print(f"Error connecting to Arduino: {e}")
        return None

# Sends a command to Arduino over serial
def send_to_arduino(arduino, command):
    if not command or not isinstance(command, str):
        print(f"Invalid message – skipping send: {command}")
        return

    try:
        arduino.write((command + '\n').encode())  
        print(f"Sent to Arduino: {command}")

        # delay to allow Arduino to process the message
        time.sleep(0.05)  
        if arduino.in_waiting:
            response = arduino.readline().decode('utf-8').strip()
            print(f"[Arduino replied]: {response}")

    except serial.SerialException as e:
        print(f"Error sending message to Arduino: {e}")














