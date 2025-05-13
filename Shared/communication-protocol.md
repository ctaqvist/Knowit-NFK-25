# Terrax9 communication protocol for rover

## Overview

Message is went over websocket secure. 
Each message must be a JSON string.

## Communication to rover

**Important**
Each communication must specify the roverID for the `roverID` key. The standard ID is `rover-001`.

### Forceful commands
The following commands are forceful and the sender fully controls the rovers response.
`START-STREAM` - Connects to server and start the stream  
`STOP-STREAM` - Stop streaming and close the connection to server    
`LIGHTS_ON` - Turn on headlights  
`LIGHTS_OFF` - Turn off headlights  

All commands should be sent in this format:
```
{
  "rover_id": -roverID-,
  "command": -command-
}
```

## Take a picture
`PIC` - Takes a pictures, sends a response in the following way:
**Example response for `PIC` from Rasberry PI**:
```
{
  "rover_id:" -roverID-,
  "type": "pic-response",
  "success": "true",
  "image_data": -base64data-
}
```
or
```
{
  "rover_id:" -roverID-,
  "type": "pic-response",
  "success": "false"
}
```


## Reactive commands

The following commands are reactive and the sender passes ownership to the rover. The rover has the ownership and decides how to react to it. It has the option to ignore the command if it sees fit.

### Steer the rover

```
{
    "rover_id": -roverID-,
    "steer": {
        "x": -xValue-,
        "y": -yValue-
    }
}
```

### Control the arm (shoulder, elbow and claw)
The arm currently has 3 axis, each axis is controlled by a value in range [-1:1].

For example: 
```
{
    "rover_id": -roverID-,
    "steer_arm": {
        "shoulder": -value-,
        "axis": -value-,
        "claw": -value-,
    }
}
```

### Battery Protection

- **battery_level**  
  A float between 0.0 (empty) and 1.0 (fully charged) indicating the current battery level.

- **warning_signal**  
  A boolean where `true` means the battery is running low.

- **sleep_mode**  
  A boolean where `true` means the rover will shut down because the battery is empty.

```json
{
  "battery_level": 0.75,
  "warning_signal": false,
  "sleep_mode": false
}
