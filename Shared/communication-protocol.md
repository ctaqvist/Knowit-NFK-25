# Terrax9 communication protocol for rover

## Overview

Message is went over websocket secure. 
Each message must be a JSON string.

## Communication to rover

**Important**
Each communication must specify the roverID for the `roverID` key. The standard ID is `rover-001`.

### Forceful commands
The following commands are forceful and the sender fully controls the rovers response.

`PIC` - Takes a picture  
`START_STREAM` - Connects to server and start the stream  
`STOP_STREAM` - Stop streaming and close the connection to server  
`LIGHT_ON` - Turn on headlights  
`LIGHT_OFF` - Turn off headlights  
`BATTERY_LEVEL` - Reports current battery level as a float (0.0 to 1.0) 
`LOW_BATTERY_WARNING` - Indicates low battery state (true = low, false = OK)
`SLEEP_MODE` - 	Initiates or cancels shutdown (true = shutdown, false = active)


## Reactive commands

The following commands are reactive and the sender passes ownership to the rover. The rover has the ownership and decides how to react to it. It has the option to ignore the command if it sees fit.

### Steer the rover

```
{
    "roverID": -roverID-,
    "steer": {
        "x": -xValue-,
        "y": -yValue-
    }
}
```

### Control the arm

```
{
    "roverID": -roverID-,
    "steer-arm": [
        "x": -xValue-,
        "y": -yValue-
    ]
}
```
