#include "Communication.h"
#include <ArduinoJson.h>

void initCommunication() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("{\"status\":\"READY\"}");
}

void handleIncomingSerial() {
  if (!Serial.available()) return;

  String input = Serial.readStringUntil('\n');
  input.trim();

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, input);

  if (error) {
    Serial.println("{\"error\":\"invalid_json\"}");
    return;
  }

  const char* command = doc["command"];
  if (command == nullptr) {
    Serial.println("{\"error\":\"missing_command\"}");
    return;
  }

  if (strcmp(command, "fwd") == 0) {
    Serial.println("{\"ack\":\"fwd\"}");
  }
  else if (strcmp(command, "stop") == 0) {
    Serial.println("{\"ack\":\"stop\"}");
  }
  else if (strcmp(command, "ping") == 0) {
    Serial.println("{\"ack\":\"pong\"}");
  }
  else if (strcmp(command, "status") == 0) {
    Serial.println("{\"status\":\"running\"}");
  }
  else if (strcmp(command, "navigate") == 0) {
    float angle = doc["angle"];
    int speed = doc["speed"];
    bool forward = doc["forward"];

    StaticJsonDocument<128> response;
    response["ack"] = "navigate";
    response["angle"] = angle;
    response["speed"] = speed;
    response["forward"] = forward;
    serializeJson(response, Serial);
    Serial.println();
  }
  else if (strcmp(command, "set_speed") == 0) {
    float speed = doc["value"];
    if (speed >= 0.0 && speed <= 1.0) {
      StaticJsonDocument<128> response;
      response["ack"] = "set_speed";
      response["value"] = speed;
      serializeJson(response, Serial);
      Serial.println();
    } else {
      Serial.println("{\"error\":\"invalid_speed_range\"}");
    }
  }
  else if (strcmp(command, "steer") == 0) {
    if (!doc.containsKey("x") || !doc.containsKey("y")) {
      Serial.println("{\"error\":\"missing_coordinates\"}");
      return;
    }

    float x = doc["x"];
    float y = doc["y"];

    StaticJsonDocument<128> response;
    response["ack"] = "steer";
    response["x"] = x;
    response["y"] = y;
    serializeJson(response, Serial);
    Serial.println();
  }
  else {
    Serial.println("{\"error\":\"unknown_command\"}");
  }

  delay(10);
}
