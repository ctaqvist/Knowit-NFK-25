from .picture import handle_pic_command
from .stream import handle_stream_command, handle_stop_stream_command
from .movement import handle_movement

async def process_command(websocket, command, params, arduino):
    if command == "PIC":
        await handle_pic_command(websocket)
    elif command == "STREAM":
        await handle_stream_command(websocket)
    elif command == "END-STREAM":
        await handle_stop_stream_command(websocket)
   
    else:
        await handle_default_command(websocket, command, params, arduino)
