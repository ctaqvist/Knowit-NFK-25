import os
import json

def handle_battery_level(level: float, websocket):
    #Tar emot batterinivå som float (t.ex. 0.5 för 50%) och skickar vidare till appen.
    #Om batterinivå är under 20% skickas även en sleep signal till appen och Pi stängs av.
    #Om batterinivå är över 20% skickas en signal till appen att Pi inte ska stängas av.
    data = {
        "type": "battery_level",
        "value": level
    }
    print(f"[Battery] Level received: {level}")
    return websocket.send(json.dumps(data))

def handle_sleep_signal(trigger: bool, websocket):
    #Tar emot signal för sleep mode. Om True → stänger av Pi. Skickas även vidare till appen.
    data = {
        "type": "sleep_mode",
        "value": trigger
    }
    if trigger:
        print("[SleepMode] Trigger received: going to sleep.")
        # Skicka till app först
        websocket.send(json.dumps(data))
         # Stäng av Raspberry Pi
        os.system("sudo shutdown now")   
    else:
        print("[SleepMode] Battery ok - not sleeping.")
        return websocket.send(json.dumps(data))

def handle_low_battery_warning(trigger: bool, websocket):
    #Tar emot bool för låg batterinivå och skickar vidare till appen.
    data = {
        "type": "low_battery_warning",
        "value": trigger
    }
    print(f"[Battery] Low battery warning: {trigger}")
    return websocket.send(json.dumps(data))