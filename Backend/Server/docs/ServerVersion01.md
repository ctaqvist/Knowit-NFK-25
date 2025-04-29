# Server documentation


## Version 01 (2025-04-29)

## Authentication

Authenticaion is implemented with JWT. There are no users however, meaning anyone get access to everything.
You can bypass authentication by sending no token, then you will automatically be a "super admin user".

## Features

### API

This version contains an API. The API is used for retriving images. It has built in authenticaion with JWT.

Routes:
`/`: Hello world test route
`/images`: Get a list available images
`/images/:name`: Get an image based on name
`/login`: Pass username and password through request body. If success, a JWT token will be created and set.

### Communication / Data channel / Websocket

Live data tranfser through data channel. All messages must be JSON format (altough server has fallback for non-json data, by converting it into {"raw": <-original message-> }).

Special commands in server:
`pong`: Respons with ping (used for connection test). This command does not need to be JSON.

Upload an image:
Through data channe, you can upload an image. To do this, send this command to the server:
`{"rover_id": "rover-001", "response":"picture_data", "image_base64": <imagedata>}`

Or manually test with this (as the server will add sender data): 
`{"rover_id": "rover-001", "response":"picture_data", "image_base64": "${imagebase64}", "sender": "[CLIENT]"}`

The server will forward each message to every other client as of right now.

### Streaming

Stream to the server via srt protocol at port 1234. Recivie it at port 9000.