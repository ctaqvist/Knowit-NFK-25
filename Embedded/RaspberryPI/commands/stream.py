import threading
import json
from hardware.video_streamer import start_video_stream, stop_video_stream
from config.settings import ROVER_ID

async def handle_stream_command(websocket):
    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "response": "Starting video stream in background..."
    }))
    stream_thread = threading.Thread(target=start_video_stream, daemon=True)
    stream_thread.start()

async def handle_stop_stream_command(websocket):
    stop_video_stream()
    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "response": "Stopped video stream."
    }))
