// Client is passed as paramter
export function sendPong(ws) {
    ws.send(JSON.stringify({ response: "pong" }));
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
        rover_id: "rover-001",
        sender: "[CLIENT]",
        response: "picture_data"
    };

    return parsed.sender === expectedValues.sender &&
        parsed.rover_id === expectedValues.rover_id &&
        parsed.response === expectedValues.response &&
        Boolean(parsed.image_base64);
}