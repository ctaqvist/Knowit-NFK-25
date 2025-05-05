#include "CommandHandler.h"
#include <ArduinoJson.h>
#include "Calculations/Drive.h"
#include "Hardware/SpotLights/SpotLight.h"

// Forward declarations
void sendAck(const String& cmd);
void sendError(const String& msg);
Drive drive (0.0f, 0.0f);
// Global variables
String inputString = "";
bool stringComplete = false;

// Create global CommandHandler instance
CommandHandler commandHandler;

void CommandHandler::init() {
    inputString.reserve(200);
    Serial.println("READY");
}

void CommandHandler::listen() {
    while (Serial.available()) {
        char inChar = (char)Serial.read();
        inputString += inChar;
        if (inChar == '\n') {
            stringComplete = true;
        }
    }

    if (stringComplete) {
        inputString.trim();
        if (inputString.length() > 0) {
            handleCommand(inputString);
        }
        inputString = "";
        stringComplete = false;
    }
}

void handleCommand(const String& cmd) {
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, cmd);

    if (!error && doc.containsKey("command")) {
        String jsonCmd = doc["command"];

        if (jsonCmd == "steer" && doc.containsKey("x") && doc.containsKey("y")) {
            float x = doc["x"];
            float y = doc["y"];
            drive.SetXY(x, y);
            drive.ExecuteDriveLogic();
            sendAck("steer");
            return;
        }

        if (jsonCmd == "BATTERY_LEVEL" && doc.containsKey("level")) {
            float level = doc["level"];
            Serial.print("Battery level: ");
            Serial.println(level * 100);  // Visa i %
            sendAck("BATTERY_LEVEL");
            return;
        }
        
        if (jsonCmd == "SLEEP_MODE" && doc.containsKey("trigger")) {
            bool trigger = doc["trigger"];
            Serial.println(trigger ? "Sleep mode ON" : "Sleep mode OFF");
            sendAck("SLEEP_MODE");
            return;
        }
        
        if (jsonCmd == "LOW_BATTERY_WARNING" && doc.containsKey("trigger")) {
            bool low = doc["trigger"];
            Serial.println(low ? "LOW BATTERY!" : "Battery OK");
            sendAck("LOW_BATTERY_WARNING");
            return;
        }
        
        if (jsonCmd == "LIGHT_ON") {
            TurnSpotLightOn();
            sendAck("LIGHT_ON");
            return;
        }

        if (jsonCmd == "LIGHT_OFF") {
            TurnSpotLightOff();
            sendAck("LIGHT_OFF");
            return;
        }

        sendError("unknown_command");
        return;
    }

    sendError("invalid_json");
}

void sendAck(const String& cmd) {
    Serial.println("{\"ack\":\"" + cmd + "\"}");
}

void sendError(const String& msg) {
    Serial.println("{\"error\":\"" + msg + "\"}");
}
