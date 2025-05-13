from hardware.camera import take_picture, get_picture_base64
from config.settings import ROVER_ID
import traceback
import json
import os

async def handle_pic_command(websocket):
    try:
        filepath = take_picture()
        if filepath and os.path.exists(filepath):
            image_b64 = get_picture_base64(filepath)
            response = {
                "rover_id": ROVER_ID,
                "type": "pic-response",
                "success": "true",
                "image_data": image_b64
            }
        else:
            raise Exception("No file saved.")
    except Exception as e:
        
        print(f"[PIC ERROR] {e}")
        traceback.print_exc()
        response = {
            "rover_id": ROVER_ID,
            "type": "pic-response",
            "success": "false"
        }

    await websocket.send(json.dumps(response))
