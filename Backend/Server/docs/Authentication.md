# Connecting to the Server After Authentication

This document explains how to connect to the server after the authentication system has been implemented.
Note: The authentication system is not finalized and may change in the future.

## Authentication Technology

The authentication system uses JSON Web Tokens (JWT). A token is generated when a user logs in, and the same token is used to authenticate access to different parts of the server.

## Connecting to WebSocket Endpoints

To connect to a WebSocket, use the following URI format:

ws://example:port?token=XYZ
Replace XYZ with the actual token.

## Accessing Protected Routes on the Server

Include the token as a query parameter in the URL, like this:

http://example?token=XYZ
## Token with Unlimited Lifetime

There is a special token with unlimited lifetime available in tokenGenerator. You can also create your own custom tokens if needed.