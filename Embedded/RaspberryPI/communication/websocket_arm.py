import json
import websockets
from config.settings import ROVER_ID, SERVER_URI
from commands.arm.handler import process_command as arm_command_handler

# Main async function to listen to server commands
async def listen_to_server():
    active_handler = None
    
    async with websockets.connect(SERVER_URI) as websocket:
        print("Connected to server")

         # Initial registration from app expected to contain 'mode'
        registration = await websocket.recv()
        print(f"[REGISTRATION] {registration}") 
        
        try:
            reg_data = json.loads(registration)
            mode = reg_data.get("mode","rover").lower()
        except json.JSONDecodeError as e:
            print(f"[ERROR] Failed to decode registration JSON: {e}")
            mode = "rover"
        
        active_handler = arm_command_handler if mode == "arm" else rover_command_handler    
        
        await websocket.send(json.dumps({
            "type": "register",
            "rover_id": ROVER_ID,
            "mode": mode
        }))
        
        print(f"[INFO] Listening in '{mode}' mode")
        
        while True:
            message = await websocket.recv()
            print(f"[RAW] {message}") 
            
            try:
                data = json.loads(message)
            except json.JSONDecodeError as e:
                print(f"[ERROR] Failed to decode JSON: {e}")
                continue    
            
            command = data.get("commands")
            params = data
            
            if command is None:
                print("[ERROR] No commands found in the message")
                continue   
            
            await active_handler(command, websocket, params)        