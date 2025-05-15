import json
import threading
import time
from communication.serial_helper import arduino

# Inställningar för kontinuerlig drive-loop
_DEADZONE = 0.05
_LOOP_INTERVAL = 0.02  # 20 ms → 50 Hz

# Global senaste steering‑värde och föregående skickade värde
_latest_steer = {"x": 0.0, "y": 0.0}
_prev_steer = {"x": None, "y": None}


def _drive_loop():
    while True:
        try:
            x = _latest_steer["x"]
            y = _latest_steer["y"]
            # Skicka bara om nytt värde utanför deadzone och ändrat
            if (abs(x) > _DEADZONE or abs(y) > _DEADZONE) and (x, y) != (_prev_steer["x"], _prev_steer["y"]):
                payload = json.dumps({"steer": {"x": round(x, 2), "y": round(y, 2)}})
                success = arduino._send_sync(payload)
                if not success:
                    print("[DRIVE_LOOP ERROR] Failed to send payload")
                else:
                    _prev_steer["x"], _prev_steer["y"] = x, y
        except Exception as e:
            print(f"[DRIVE_LOOP EXCEPTION] {e}")
            time.sleep(0.1)
        time.sleep(_LOOP_INTERVAL)

# Starta driveloppet i en daemon-tråd
threading.Thread(target=_drive_loop, daemon=True).start()

async def forward_joystick_to_arduino(steer_data):
    """
    Uppdaterar globala styrvärden som bakgrundstråden sedan skickar.
    """
    try:
        x = float(steer_data.get("x", 0.0))
        y = float(steer_data.get("y", 0.0))
    except (TypeError, ValueError):
        return  # Ogiltiga data → skippa

    # Uppdatera senaste värde (enkla floats, thread-safe)
    _latest_steer["x"] = x
    _latest_steer["y"] = y
