import serial
import time

def connect_to_arduino(port='/dev/ttyACM0', baudrate=9600):
    arduino = serial.Serial(port, baudrate)
    time.sleep(2)
    return arduino

def send_to_arduino(arduino, message):
    arduino.write((message + '\n').encode())
