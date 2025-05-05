import threading
import json
from hardware.video_streamer import *
from config.settings import ROVER_ID
# These two functions handle starting and stopping the video stream from the rover.

# 1. handle_stream_command:
#    - Sends a message back over WebSocket saying the video stream is starting.
#    - Starts the video stream in a separate background thread, so it doesn't block other tasks.

# These two functions handle starting and stopping the video stream from the rover.

# 1. handle_stream_command:
#    - Sends a message back over WebSocket saying the video stream is starting.
#    - Starts the video stream in a separate background thread, so it doesn't block other tasks.
async def handle_stream_command(websocket):
    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "response": "Starting video stream in background..."
    }))
    stream_thread = threading.Thread(target=start_video_stream, daemon=True)
    stream_thread.start()

# 2. handle_stop_stream_command:
#    - Stops the video stream.
#    - Sends a confirmation message back over WebSocket saying the stream has stopped.
async def handle_stop_stream_command(websocket):
    stop_video_stream()
    await websocket.send(json.dumps({
        "rover_id": ROVER_ID,
        "response": "Stopped video stream."
    }))