import WebSocket from 'ws';

// Client is passed as paramter
export function sendPong(ws) {
    ws.send(JSON.stringify({ response: "pong" }));
}

// Already checked that parsed has connect command
// Dictionary that contatins if a user is connected to a rover
export function connectToRover(parsed, userRoverDict, ws, clients) {
    const userId = ws.token.userId;
    const roverId = parsed.rover_id;

    // 1. Check if the rover is connected to the server (otherwise send error and throw return)
    if (!isRoverConnected(roverId, clients)) {
        ws.send(JSON.stringify({
            response: "error",
            message: `Rover ${roverId} is not connected to the server.`
        }));
        return;
    }

    // 2. Check if the rover is already in use (otherwise send error and throw return)
    if (isRoverInUse(roverId, userRoverDict)) {
        ws.send(JSON.stringify({
            response: "error",
            message: `Rover ${roverId} is already in use by another user.`
        }));
        console.log(`User ${userId} attempted to connect to rover ${roverId}, but it is already in use.`);
        return;
    }

    //3. Check if user is already connected to a rover (otherwise send error and throw return)
    const userIsConncted = isUserConnectedToRover(userId, userRoverDict);
    console.log("user is connected: ", userIsConncted)
    if (isUserConnectedToRover(userId, userRoverDict)) {
        console.log("User with id ", userId, " is already connected to rover: ", userRoverDict[userId])
        ws.send(JSON.stringify({
            response: "error",
            message: `User ${userId} is already connected to a rover.`
        }));
        console.log(`User ${userId} is already connected to a rover.`);
        return;
    }

    // Check if the user is already connected to a rover
    if (!userRoverDict[userId]) {
        userRoverDict[userId] = roverId;
        console.log("User with id ", userId, " is connected to rover: ", roverId)
        console.log(userRoverDict)
        ws.send(JSON.stringify({
            response: "success",
            message: `Connected to rover ${roverId}.`
        }));
    }
}

// Checks if a rover is already assigned to a user
function isRoverInUse(roverId, userRoverDict) {
    return Object.values(userRoverDict).includes(roverId);
}

// Check if user is already connected to a rover
function isUserConnectedToRover(userId, userRoverDict) {
    return Object.keys(userRoverDict).includes(userId.toString());
}

//Check if a rover with a given id is connected to server
function isRoverConnected(roverId, clients) {
    const roverClient = [...clients].find(client => client.token && client.token.roverSerial === roverId);
    return roverClient && roverClient.readyState === WebSocket.OPEN;
}


//Send message to all clients, if client is sender, recieves server:obj else client : obj
export function forwardMessageToAllClients(parsed, clients, ws) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                sender: client === ws ? '[SERVER]' : '[CLIENT]', ...parsed
            }))
        }
    })
}

// Send message to specific client which is specified in the message
export function forwardMessageToTargetClient(parsed, clients, ws, userRoverDict) {
    // Determine sender type
    const senderIsUser = ws.token && ws.token.userId;
    const senderIsRover = ws.token && ws.token.roverSerial;

    if (senderIsUser) {
        // User is sending: find their mapped rover
        const roverId = userRoverDict[ws.token.userId];
        if (!roverId) {
            console.log("No rover mapped for this user.");
            return;
        }

        
        const roverClient = [...clients].find(client => client.token && client.token.roverSerial === roverId);
        if (roverClient && roverClient.readyState === WebSocket.OPEN) {
            roverClient.send(JSON.stringify({
                sender: '[USER]', ...parsed
            }));
        } else {
            console.log("Mapped rover client not found or not connected!");
        }
    } else if (senderIsRover) {
        // Rover is sending: find the user mapped to this rover
        const roverSerial = ws.token.roverSerial;
        const userId = Object.keys(userRoverDict).find(userId => userRoverDict[userId] === roverSerial);
        if (userId) {
            const userClient = [...clients].find(client => {
                return client.token && client.token.userId == userId
            });
            if (userClient && userClient.readyState === WebSocket.OPEN) {
                userClient.send(JSON.stringify({
                    sender: '[ROVER]', ...parsed
                }));
            }
        } else {
            console.log("No user mapped to this rover.");
        }
    } else {
        console.log("Sender is neither user nor rover.");
    }
}

//Parse json
export function parseJsonMessage(message) {
    try {
        const parsed = JSON.parse(message);
        return parsed
    }
    catch (err) {
        console.warn("Message isn't valid JSON. Parsing as raw...")
        const parsed = { raw: message.toString() }
        return parsed
    }
}

export function containsImageData(parsed) {
    const expectedValues = {
        sender: "[ROVER]",
        response: "picture_data"
    };

    return parsed.sender === expectedValues.sender &&
        parsed.response === expectedValues.response &&
        Boolean(parsed.image_base64);
}

// If user or rover is disconnected, remove the connection
export function removeConnectionFromUserRoverDict(ws, userRoverDict, clients) {
    if (!ws.token) {
        console.log("No token found in the WebSocket connection.");
        return;
    }
    const userId = ws.token.userId;
    const roverSerial = ws.token.roverSerial;

    if (userId) {
        const roverId = userRoverDict[userId];
        if (roverId) {
            const roverClient = [...clients].find(client => client.token && client.token.roverSerial === roverId);

            if (roverClient && roverClient.readyState === WebSocket.OPEN) {
                roverClient.send(JSON.stringify({
                    response: "disconnected",
                    message: `User ${userId} has disconnected from rover ${roverId}.`
                }));
            }
            delete userRoverDict[userId];
            console.log(`User with id ${userId} is disconnected from rover: ${roverId}`);
            console.log(userRoverDict);
        }
    } else if (roverSerial) {
        const mappedUserId = Object.keys(userRoverDict).find(uid => userRoverDict[uid] === roverSerial);

        if (mappedUserId) {
            const userClient = [...clients].find(client => client.token && client.token.userId == mappedUserId);
            if (userClient && userClient.readyState === WebSocket.OPEN) {
                userClient.send(JSON.stringify({
                    response: "disconnected",
                    message: `Rover ${roverSerial} has disconnected from user ${mappedUserId}.`
                }));
            }
            delete userRoverDict[mappedUserId];
            console.log(`Rover with id ${roverSerial} is disconnected from user: ${mappedUserId}`);
            console.log(userRoverDict);
        }
    } else {
        console.log("No user or rover id found in the dictionary.");
    }
}

export function disconnectFromRover(ws, parsed, userRoverDict) {
    const userId = ws.token.userId;
    const roverId = parsed.rover_id;

    if (userRoverDict[userId] === roverId) {
        delete userRoverDict[userId];
        console.log(`User ${userId} disconnected from rover ${roverId}.`);
        ws.send(JSON.stringify({
            response: "success",
            message: `Disconnected from rover ${roverId}.`
        }));
    } else {
        ws.send(JSON.stringify({
            response: "error",
            message: `User ${userId} is not connected to rover ${roverId}.`
        }));
    }
}