# Protecting Rover-to-Server Communication from Man-in-the-Middle Attacks

## What is a Man-in-the-Middle Attack?

A Man-in-the-Middle attack happens when a bad actor secretly listens to or changes the messages between two devices — for example, between rover and the server. This can cause serious problems, like:

- Someone reading private data
- Sending fake commands to the rover
- Changing what the rover receives or sends

## TLS Is the Solution

The solution to this problem is to use TLS (Transport Layer Security). TLS protects the connection by encrypting the data and making sure the server is real. This stops attackers from reading, changing, or faking the messages. 

## Why the Server Was Not Safe Before

Before using TLS encryption, the connection used `http` and `ws`, which are not secure. These types of connections send data as plain text. That means:

- Hackers could easily see or steal the data
- Someone could pretend to be the server (spoofing)
- Messages could be changed without anyone knowing

## Why It Is Secure Now

Now, Emil has added TLS encryption. The server uses `https` and `wss` instead of `http` and `ws`. This makes the connection secure in three ways:

1. **Encryption** – All data between the rover and the server is hidden from others.
2. **Identity check** – The rover can check that it is really talking to the correct server (not a fake one).
3. **Stops attackers** – Hackers cannot see, change, or fake the data anymore.

This works because Emil used NGINX as a reverse proxy and set up TLS certificates using Certbot. Now, when the rover connects using `wss://terrax9.se`, it checks the server's certificate to make sure the connection is safe and trusted.
