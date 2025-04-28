try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None  # CI won’t have pyserial

import time

class ArduinoConnection:
    def __init__(self):
        self.baudrate = 9600
        self.serial = None

    def find_arduino_port(self):
        if serial is None:
            # no serial module → can’t discover; tests won’t hit this
            return None

        ports = serial.tools.list_ports.comports()
        known_arduino_vid_pid = [
            (0x2341, 0x0069),  # Arduino Uno R4 Minima
        ]

        for port in ports:
            if (port.vid, port.pid) in known_arduino_vid_pid:
                print(f"Found Arduino on {port.device}")
                return port.device
            else:
                print(f"Skipped {port.device} – not Uno R4 Minima")
        print("Could not find Arduino Uno R4 Minima.")
        return None

    def connect(self):
        if serial is None:
            # stubbed out in CI
            return

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

    def send(self, message: str) -> bool:
        # Tests will patch this method directly.
        if not message or not isinstance(message, str):
            print(f"Invalid message – skipping: {message}")
            return False

        if self.serial:
            try:
                self.serial.write((message + "\n").encode())
                print(f"Sent to Arduino: {message}")
                time.sleep(0.05)
                if self.serial.in_waiting:
                    response = self.serial.readline().decode().strip()
                    print(f"Arduino replied: {response}")
                return True
            except (serial.SerialException, OSError) as e:
                print(f"Error sending: {e}")
                return False

        # If serial module missing or not connected → no-op
        print(f"[Stub send] {message}")
        return True

    def read_received_data(self) -> str:
        if not self.serial:
            return ""
        try:
            return self.serial.readline().decode("utf-8").strip()
        except (serial.SerialException, OSError) as e:
            print(f"Error reading: {e}; reconnecting...")
            return ""

# global instance
arduino = ArduinoConnection()
