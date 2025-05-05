# High Level architecture design
Communication between **APP** <-> **SERVER** <-> **ROVER**

**Ticket: High level architecture design for communication of the server with the app and rover**

___

## High level Infrastructure

### The initial plan look like this:

Components:

- Backend (Server)
- Rover application (Client, e.g. a device)
- Rover and app (ran on Rasperry pie)

### Server

The server is planned to be a **public open server not hosted at knowit**. This to ensure true long distance and hopefully no connection issues. It might introudce some security challenges, but those could easily be by fixed by whitelisting IP. It also introduces a concern about delay. After testing RTT to our test server hosted in stockholm we got an average of **12.19 ms** for short text-transfers, which seems acceptable

However if delay is too big and we need P2P workarounds could be set:

- Set up our own network
- Use mobile hotspot on phone

### Data transfer

One option is to use one socket for streaming and one or other data. Another option can be to combine them into one.

#### Streaming

We have note yet commited how to stream. We have some options with its pros and cons.

This is under research by Mojtaba

#### Other data  (e.g. commands and images)

Probably create our own protocol with commands

### Store images

We are allowed to only store images on client. However, it should be straight forward to also store them on serverside in a file database.