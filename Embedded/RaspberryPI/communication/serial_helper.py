import threading
import time
import asyncio

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
        self.loop_queue: asyncio.Queue = None

        # Start watcher thread immediately
        self.watcher_thread = threading.Thread(
            target=self._watch_serial_connection,
            daemon=True
        )
        self.watcher_thread.start()

    def set_loop_queue(self, queue: asyncio.Queue):
        """Link an asyncio.Queue for incoming serial lines."""
        self.loop_queue = queue

    def find_arduino_port(self):
        if serial is None:
            return None

        ports = serial.tools.list_ports.comports()
        known = [
            (0x2341, 0x0069),
            (0x2341, 0x1002),
            (0x2341, 0x0043),
        ]
        for p in ports:
            if (p.vid, p.pid) in known:
                return p.device
        return None

    def connect(self):
        if serial is None:
            return
        while self.keep_alive and self.serial is None:
            port = self.find_arduino_port()
            if port:
                try:
                    with self.lock:
                        # Non-blocking read timeout
                        self.serial = serial.Serial(port, self.baudrate, timeout=0.01)
                    print(f"[Arduino] Connected on {port}")
                    time.sleep(2)  # allow port to stabilize
                except serial.SerialException as e:
                    print(f"[Arduino] Connection error: {e}")
            else:
                print("[Arduino] Not found. Retrying in 2s…")
            time.sleep(2)

    def _watch_serial_connection(self):
        # Ensure connection on start
        self.connect()
        # Tight loop: read everything without long sleeps
        while self.keep_alive:
            if self.serial and self.serial.is_open:
                try:
                    with self.lock:
                        n = self.serial.in_waiting
                        chunk = self.serial.read(n).decode("utf-8", errors="ignore") if n else ""
                except Exception as e:
                    print(f"[Arduino] Read error: {e}")
                    with self.lock:
                        self.serial = None
                    continue

                if chunk and self.loop_queue:
                    for line in chunk.splitlines():
                        line = line.strip()
                        if line:
                            self.loop_queue.put_nowait(line)
                # No sleep needed; timeout ensures brief waits
            else:
                with self.lock:
                    self.serial = None
                self.connect()

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
        return False

    async def send(self, message: str) -> bool:
        # Dispatch to thread to avoid blocking asyncio loop
        return await asyncio.to_thread(self._send_sync, message)

    def stop(self):
        self.keep_alive = False
        if self.serial and self.serial.is_open:
            with self.lock:
                self.serial.close()

# Global instance
arduino = ArduinoConnection()
