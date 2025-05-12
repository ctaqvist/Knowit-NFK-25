#include "CommandHandler.h"
#include <ArduinoJson.h>
#include "Calculations/Drive.h"
#include "Hardware/SpotLights/SpotLight.h"

// Forward declarations
void sendAck(const char* type);
void sendError(const char* msg);

// Global objects and buffers
Drive drive(0.0f, 0.0f);
String inputBuffer;
const size_t BUFFER_MAX = 200;

// CommandHandler instance
typedef struct {} CommandHandler; // placeholder if needed

void CommandHandler::init() {
    inputBuffer.reserve(BUFFER_MAX);
    Serial.begin(115200);
    Serial.println("{\"status\":\"READY\"}");
}

void CommandHandler::listen() {
    // Non-blocking read using in_waiting
    while (Serial.available()) {
        char c = Serial.read();
        if (c == '\n') {
            if (inputBuffer.length() > 0) {
                handleCommand(inputBuffer);
            }
            inputBuffer = "";
        } else {
            inputBuffer += c;
            if (inputBuffer.length() > BUFFER_MAX) {
                inputBuffer = "";
                sendError("buffer_overflow");
            }
        }
    }
}

void handleCommand(const String &raw) {
    StaticJsonDocument<256> doc;
    DeserializationError err = deserializeJson(doc, raw);
    if (err) {
        sendError("invalid_json");
        return;
    }
    // Steering commands now in object "steer"
    if (doc.containsKey("steer")) {
        JsonObject steer = doc["steer"].as<JsonObject>();
        if (steer.containsKey("x") && steer.containsKey("y")) {
            float x = steer["x"];
            float y = steer["y"];
            drive.SetXY(x, y);
            drive.ExecuteDriveLogic();
            sendAck("steer");
            return;
        }
    }
    // Spot lights commands
    if (doc.containsKey("command")) {
        const char* cmd = doc["command"];
        if (strcmp(cmd, "LIGHTS_ON") == 0) {
            TurnSpotLightOn();
            sendAck("LIGHTS_ON");
            return;
        }
        if (strcmp(cmd, "LIGHTS_OFF") == 0) {
            TurnSpotLightOff();
            sendAck("LIGHTS_OFF");
            return;
        }
    }
    sendError("unknown_command");
}

void sendAck(const char* type) {
    StaticJsonDocument<128> out;
    out["ack"] = type;
    out["ts"]  = millis();
    serializeJson(out, Serial);
    Serial.println();
}

void sendError(const char* msg) {
    StaticJsonDocument<128> out;
    out["error"] = msg;
    out["ts"]    = millis();
    serializeJson(out, Serial);
    Serial.println();
}
