# Server documentation

## Version 01 (2025-04-29)

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
`pong`: Respons with ping (used for connection test).