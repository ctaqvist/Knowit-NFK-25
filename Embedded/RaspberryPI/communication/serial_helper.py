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
        self.baudrate   = 115200
        self.serial     = None
        self.lock       = threading.Lock()
        self.keep_alive = True

        # Nytt: en asyncio-vänlig kö där vi kan "put_nowait" inkommande rader
        self.loop_queue = None  

        # Starta watcher-tråden direkt
        self.watcher_thread = threading.Thread(
            target=self._watch_serial_connection,
            daemon=True
        )
        self.watcher_thread.start()

    def set_loop_queue(self, queue: asyncio.Queue):
        """Anropa från din asyncio-loop för att koppla en kö."""
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
                        self.serial = serial.Serial(port, self.baudrate, timeout=1)
                    print(f"[Arduino] Connected on {port}")
                    time.sleep(2)  # låt porten stabilisera sig
                except serial.SerialException as e:
                    print(f"[Arduino] Connection error: {e}")
            else:
                print("[Arduino] Not found. Retrying in 2s…")
            time.sleep(2)

    def _watch_serial_connection(self):
        # Se till att vi är uppkopplade direkt
        self.connect()

        # Så fort vi har en öppen port, kör en tight loop för att läsa allt
        while self.keep_alive:
            if self.serial and self.serial.is_open:
                raw = self.read_received_data()
                if raw and self.loop_queue:
                    # Stoppa in varje rad i asyncio-kön för asynkron hantering
                    self.loop_queue.put_nowait(raw)
                # kör tight för låg latens, lägger in kort paus så CPU inte spökar
                time.sleep(0.01)
            else:
                # reconnect om porten stängts
                with self.lock:
                    self.serial = None
                self.connect()

    def _send_sync(self, message: str) -> bool:
        """Synkront sändningsstöd, anropas via asyncio.to_thread."""
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
     Skickar ett meddelande över seriellporten utan att blockera asyncio-loopen.

     Den underliggande _send_sync-metoden är synkron och blockerande, 
     så här kör vi den i en separat tråd via asyncio.to_thread(). 
     På så sätt kan huvudloopen fortsätta hantera andra asynkrona 
     uppgifter (t.ex. WebSocket-kommunikation) medan skrivningen 
     mot Arduino sker i bakgrunden.
    """
     return await asyncio.to_thread(self._send_sync, message)

    def read_received_data(self) -> str:
        if not self.serial:
            return ""
        try:
            with self.lock:
                return self.serial.readline().decode("utf-8").strip()
        except Exception as e:
            print(f"[Arduino] Read error: {e}")
            with self.lock:
                self.serial = None
            return ""

    def stop(self):
        self.keep_alive = False
        if self.serial:
            with self.lock:
                self.serial.close()

# Global instans
arduino = ArduinoConnection()