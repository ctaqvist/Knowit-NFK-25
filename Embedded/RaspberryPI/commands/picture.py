from hardware.camera import take_picture, get_picture_base64
from config.settings import ROVER_ID
import json

# This function handles the "take picture" command from the WebSocket.

async def handle_pic_command(websocket):
    filepath = take_picture()
    image_b64 = get_picture_base64(filepath)

    if image_b64:
        await websocket.send(json.dumps({
            "rover_id": ROVER_ID,
            "response": "picture_data",
            "image_base64": image_b64
        }))
