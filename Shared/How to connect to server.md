# How to connect to server

(From ticket 242)
Last changed: 2025-05-13

## General

IP: 13.60.235.253
Domain: terrax9.se

Data: default (right now 443) (with websocket, wss)
Streaming inbound port 1234 (with srt)
Streaming outbound port 9000 (with websocket, wss)

## How rover connects to the server

Rover should send a POST request to:

https://v2.terrax9.se/rover/login

A JSON like this:
```
{
    "roverSerial": "rover-001",
    "password": "1234"
}
```
Note that "rover-001" is just a development example in the database. For different rovers, the serial and the password will be different.

If the credentials are correct, the rover will receive a response like this:
```
{
    "token": "a token"
}
```
otherwise a json response with status 401 like this:
```
{
    "message": "Invalid credentials"
}
```
Later, when the rover wants to connect to the WebSocket, the token should be added to the WebSocket query like this:
```
wss://v2.terrax9.se:PORT?token=tokenThatYouGotBefore
```

## How app connects to the server

For communication the app should connect with Websocket on port 80 with wss.

## How to stream to the server

The rover should stream via STR on port 1234 to the server. The video should be encoded to `mpegts`.

## How app listen to the server

The app should listen to the server on port 9000 via websockets. The video is encoded as `mpegts`.