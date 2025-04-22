# Manual to Set Up Raspberry Pi Server

This guide will help you set up and start the server on your Raspberry Pi.

## Prerequisites
1. Ensure you have Node.js and npm installed on your Raspberry Pi.
2. Clone or download the server project to your Raspberry Pi.

## Steps to Set Up and Start the Server

1. Open a terminal and navigate to the server directory:
    ```bash
    cd Backend/Server
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    node app.js
    ```

Your server should now be running. You can access it as per the configuration in your project.

## Steps to Connect Raspberry Pi to Arduino

1. Create a Python virtual environment:
    ```bash
    python3 -m venv .venv
    ```

2. Activate the virtual environment:
    ```bash
    source .venv/bin/activate
    ```

3. Install the required Python package:
    ```bash
    pip install websockets
    ```

4. Run the Python script to establish the connection:
    ```bash
    python3 main.py
    ```

Your Raspberry Pi should now be connected to the Arduino.

---

### Example Output

Below is an example of the output you might see when running the Python script to connect the Raspberry Pi to the Arduino:

![Example Output]("Connection between server and RPI.png"g)

This output shows the connection status, the received parameters, and any relevant debug messages.