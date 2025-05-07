import threading
import time
import asyncio

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None

class ArduinoConnection:
    # Ny funktion för multitrådning
    def _handle_obstacle_detected(self):
        import requests
        from config.settings import LOCAL_TEST

        if LOCAL_TEST:
            print("[LOCAL TEST] OBSTACLE_DETECTED signal received.")
            return

        try:
            response = requests.post(
                "https://terrax9.se/obstacle",  # eller ändra till rätt endpoint
                json={"rover_id": "rover-001", "event": "OBSTACLE_DETECTED"},
                timeout=5
            )
            print(f"[SERVER] Sent OBSTACLE_DETECTED. Response: {response.status_code}")
        except Exception as e:
            print(f"[SERVER ERROR] Failed to report obstacle: {e}")

    
    # Ny funktion för multitrådning
    def _listen_for_messages(self):
        while self.keep_alive:
            message = self.read_received_data()
            if message:
                print(f"[Arduino -> Pi] Received: {message}")
                if message == "OBSTACLE_DETECTED":
                    self._handle_obstacle_detected()
            time.sleep(0.1)  # avoid tight loop

    def __init__(self):
        self.baudrate = 115200
        self.serial = None
        self.lock = threading.Lock()
        self.keep_alive = True
        self.watcher_thread = threading.Thread(target=self._watch_serial_connection, daemon=True)
        # Används för multitrådning
        self.message_listener_thread = threading.Thread(target=self._listen_for_messages, daemon=True)
        self.message_listener_thread.start()

        self.watcher_thread.start()

    def find_arduino_port(self):
        if serial is None:
            return None

        ports = serial.tools.list_ports.comports()
        known_arduino_vid_pid = [
            (0x2341, 0x0069),  # Arduino Uno R4 Minima
            (0x2341, 0x1002),
            (0x2341, 0x0043)
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

    def _send_sync(self, message: str) -> bool:
        if not message or not isinstance(message, str):
            return False
        if self.serial:
            try:
                with self.lock:
                    self.serial.write((message + "\n").encode())
                return True
            except (serial.SerialException, OSError):
                with self.lock:
                    self.serial = None
                return False
        else:
            return False

    async def send(self, message: str) -> bool:
        return await asyncio.to_thread(self._send_sync, message)

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
