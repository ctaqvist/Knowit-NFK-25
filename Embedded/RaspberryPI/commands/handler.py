from .picture import handle_pic_command
from .stream import handle_stream_command, handle_stop_stream_command
from .movement import handle_movement

# This function processes incoming commands sent over a WebSocket connection.

async def process_command(websocket, command, params, arduino):
    if command == "PIC":
        await handle_pic_command(websocket)
    elif command == "STREAM":
        await handle_stream_command(websocket)
    elif command == "END-STREAM":
        await handle_stop_stream_command(websocket)
   
    else:
        await handle_movement(command, params, websocket, arduino)

