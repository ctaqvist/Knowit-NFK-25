from commands.arm.forwarder import forward_arm

# Handles commands specific to the robot arm
async def process_command(websocket, command, params):
    if "steer-arm" in params:
       await forward_arm(params["steer-arm"],websocket)  
       return
# Fallback to direct command mode
async def handle_arm_command(command, params, websocket):
    if command == "arm":
        await forward_arm(params, websocket)
    else:         
        await websocket.send("[ERROR] Unsupported arm command")