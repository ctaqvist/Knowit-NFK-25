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
        """Link an asyncio.Queue for incoming serial lines"""
        self.loop_queue = queue

    def find_arduino_port(self):
        if serial is None:
            return None

        ports = serial.tools.list_ports.comports()
        known_arduino_vid_pid = [
            (0x2341, 0x0069),
            (0x2341, 0x1002),
            (0x2341, 0x0043),
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
                        # Use low timeout for non-blocking read
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

        while self.keep_alive:
            if self.serial and self.serial.is_open:
                try:
                    with self.lock:
                        n = self.serial.in_waiting
                        if n:
                            chunk = self.serial.read(n).decode("utf-8", errors="ignore")
                        else:
                            chunk = ""
                except Exception as e:
                    print(f"[Arduino] Read error: {e}")
                    with self.lock:
                        self.serial = None
                    continue

                if chunk and self.loop_queue:
                    for line in chunk.splitlines():
                        if line.strip():
                            self.loop_queue.put_nowait(line.strip())

                # no blocking sleep needed when using in_waiting
            else:
                # reconnect if port closed
                with self.lock:
                    self.serial = None
                self.connect()

    def _send_sync(self, message: str) -> bool:
        """Blocking send called via asyncio.to_thread."""
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
        """
        Send a message over serial without blocking the asyncio loop by
        dispatching to a thread.
        """
        return await asyncio.to_thread(self._send_sync, message)

    def stop(self):
        self.keep_alive = False
        if self.serial:
            with self.lock:
                self.serial.close()

# Global instance
arduino = ArduinoConnection()
