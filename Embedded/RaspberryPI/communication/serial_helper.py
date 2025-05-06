import threading
import time

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None

class ArduinoConnection:
    def __init__(self):
        self.baudrate = 115200
        self.serial = None
        self.lock = threading.Lock()
        self.keep_alive = True
        self.watcher_thread = threading.Thread(target=self._watch_serial_connection, daemon=True)
        self.watcher_thread.start()

    def find_arduino_port(self):
        if serial is None:
            return None

        ports = serial.tools.list_ports.comports()
        known_arduino_vid_pid = [
            (0x2341, 0x0069),  # Arduino Uno R4 Minima
            (0x2341, 0x1002)
        ]

        for port in ports:
            if (port.vid, port.pid) in known_arduino_vid_pid:
                return port.device
        return None

    def connect(self):
        if serial is None:
            return

        while self.keep_alive and self.serial is None:
            port = self.find_arduino_port()
            if port:
                try:
                    with self.lock:
                        self.serial = serial.Serial(port, self.baudrate, timeout=1)
                    print(f"[Arduino] Connected on {port}")
                    time.sleep(2)
                except serial.SerialException as e:
                    print(f"[Arduino] Connection error: {e}")
            else:
                print("[Arduino] Not found. Retrying in 2s...")
            time.sleep(2)

    def _watch_serial_connection(self):
        while self.keep_alive:
            if self.serial:
                if not self.serial.is_open:
                    print("[Arduino] Serial port closed unexpectedly. Reconnecting...")
                    with self.lock:
                        self.serial = None
                    self.connect()
            else:
                self.connect()
            time.sleep(2)

    def send(self, message: str) -> bool:
        if not message or not isinstance(message, str):
            print(f"[Arduino] Invalid message – skipping: {message}")
            return False

        if self.serial:
            try:
                with self.lock:
                    self.serial.write((message + "\n").encode())
                print(f"[Arduino] Sent: {message}")
                return True
            except (serial.SerialException, OSError) as e:
                print(f"[Arduino] Send error: {e}. Resetting connection...")
                with self.lock:
                    self.serial = None
                return False
        else:
            print("[Arduino] Not connected. Message not sent.")
            return False

    def read_received_data(self) -> str:
        if not self.serial:
            return ""
        try:
            with self.lock:
                return self.serial.readline().decode("utf-8").strip()
        except (serial.SerialException, OSError) as e:
            print(f"[Arduino] Read error: {e}")
            with self.lock:
                self.serial = None
            return ""

    def stop(self):
        self.keep_alive = False
        if self.serial:
            with self.lock:
                self.serial.close()

# Global instance
arduino = ArduinoConnection()
