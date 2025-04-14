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
`START-STREAM` - Connects to server and start the stream  
`STOP-STREAM` - Stop streaming and close the connection to server  
`TANKTURN` - Perform a tank turn  
`HEADLIGHT_ON` - Turn on headlights  
`HEADLIGHT_OFF` - Turn off headlights  
`FWD` - Move the rover forward
`STOP` - Stop all rover movement

## Reactive commands

The following commands are reactive and the sender passes ownership to the rover. The rover has the ownership and decides how to react to it. It has the option to ignore the command if it sees fit.

### Steer the rover

```
{
    "roverID": -roverID-,
    "steer": [
        "x": -xValue-,
        "y": -yValue-
    ]
}
```

**Example command** recommends the rover to go straight. 
```
{
    "roverID": "rover-001",
    "steer": [
        "x": 0.00,
        "y": 1.00
    ]
}
```

**Example command** recommends the rover to rotate clock-wise in place

```
{
    "roverID": "rover-001",
    "steer": [
        "x": 1.00,
        "y": 0.00
    ]
}
```

**Example command** recommends the rover to rotate anti-clock-wise

```
{
    "roverID": "rover-001",
    "steer": [
        "x": 0.00,
        "y": -1.00
    ]
}
```

**Example command** recommends the rover to go 45 degrees to the left

```
{
    "roverID": "rover-001",
    "steer": [
        "x": 0.70,
        "y": 0.70
    ]
}
```

