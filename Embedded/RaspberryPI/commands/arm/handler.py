from commands.arm.forwarder import forward_arm

# Handles arm-specific commands only
def is_arm_command(command):
    return command == "arm"

async def process_command(websocket, command, params):
    if is_arm_command(command):
        await forward_arm(params, websocket)
    else:
       await websocket.send("[ERROR] Unsupported arm command")