import serial
import json
import time
import serial.tools.list_ports

class ArduinoConnection:
    def __init__(self, baudrate=9600):
        self.baudrate = baudrate
        self.serial = None
        self.connect()

    def find_arduino_port(self):
        ports = serial.tools.list_ports.comports()
        for port in ports:
            if "Arduino" in port.description or "ttyACM" in port.device or "ttyUSB" in port.device:
                print(f"Found Arduino on {port.device}")
                return port.device
        print("Could not find Arduino automatically.")
        return None

    def connect(self):
        while True:
            port = self.find_arduino_port()
            if port is None:
                time.sleep(2)
                continue
            try:
                self.serial = serial.Serial(port, self.baudrate, timeout=1)
                time.sleep(2)
                print(f"Connected to Arduino on {port}")
                break
            except serial.SerialException as e:
                print(f"Error connecting to Arduino: {e}. Retrying...")
                time.sleep(2)

    def send(self, message):
        if not message or not isinstance(message, str):
            print(f"Invalid message – skipping send: {message}")
            return
        try:
            self.serial.write((message + '\n').encode())
            print(f"Sent to Arduino: {message}")
            time.sleep(0.05)
            if self.serial.in_waiting:
                response = self.serial.readline().decode().strip()
                print(f"Arduino replied: {response}")
                return response
        except (serial.SerialException, OSError) as e:
            print(f"Error sending to Arduino: {e}. Reconnecting...")
            self.connect()

    def read_line(self):
        try:
            return self.serial.readline().decode('utf-8').strip()
        except (serial.SerialException, OSError) as e:
            print(f"Error reading from Arduino: {e}. Reconnecting...")
            self.connect()
            return ""

# Global instance
arduino = ArduinoConnection()












