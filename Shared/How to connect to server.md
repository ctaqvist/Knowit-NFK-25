# How to connect to server

(From ticket 43)
Last changed: 2025-04-14 

## General

IP: 13.60.235.253
Domain: terrax9.se

Data: default (right now 443) (with websocket, wss)
Streaming inbound port 1234 (with srt)
Streaming outbound port 9000 (with websocket, wss)

## How rover connects to the server

For communication the rover should connect with Websocket on port 80 with wss.

## How app connects to the server

For communication the app should connect with Websocket on port 80 with wss.

## How to stream to the server

The rover should stream via STR on port 1234 to the server. The video should be encoded to `mpegts`.

## How app listen to the server

The app should listen to the server on port 9000 via websockets. The video is encoded as `mpegts`.