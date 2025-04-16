#include "Backend/CommandHandler.h"
#include "Hardware/MotorControl.h"
#include <ArduinoJson.h>

String inputString = "";
bool stringComplete = false;

CommandHandler commandHandler;

void CommandHandler::init() {
  inputString.reserve(200);
  Serial.println("{\"status\":\"READY\"}");
}

void CommandHandler::listen() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n') stringComplete = true;
  }

  if (stringComplete) {
    inputString.trim();
    if (inputString.length() > 0) handleCommand(inputString);
    inputString = "";
    stringComplete = false;
  }
}

void CommandHandler::sendAck(const String& cmd) {
  Serial.println("{\"ack\":\"" + cmd + "\"}");
}

void CommandHandler::sendError(const String& msg) {
  Serial.println("{\"error\":\"" + msg + "\"}");
}

void CommandHandler::handleSpeedCommand(float speed) {
  speed = constrain(speed, 0.0, 1.0);
  int pwm = int(speed * 255.0);
  motorControl.setMotors(pwm, pwm);
}

void CommandHandler::handleCommand(String cmd) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, cmd);

  if (!error) {
    // 💡 Format 1: {"command": "steer", "x": ..., "y": ...}
    if (doc.containsKey("command")) {
      String jsonCmd = doc["command"];

      if (jsonCmd == "set_speed" && doc.containsKey("value")) {
        float speed = doc["value"];
        handleSpeedCommand(speed);
        sendAck("set_speed");
        return;
      }

      if (jsonCmd == "steer" && doc.containsKey("x") && doc.containsKey("y")) {
        float x = doc["x"];
        float y = doc["y"];
        // motorControl.steer(x, y);
        sendAck("steer_direct");
        return;
      }

      executePlainCommand(jsonCmd);
      return;
    }

    // 💡 Format 2: {"steer": {"x": ..., "y": ...}}
    if (doc.containsKey("steer")) {
      JsonObject steer = doc["steer"];
      float x = steer["x"];
      float y = steer["y"];
      // motorControl.steer(x, y);
      sendAck("steer_nested");
      return;
    }
  }

  executePlainCommand(cmd); // fallback
}

void CommandHandler::executePlainCommand(String cmd) {
  if (cmd == "fwd") motorControl.setState(forward), sendAck("fwd");
  else if (cmd == "bwd") motorControl.setState(backward), sendAck("bwd");
  else if (cmd == "left") motorControl.setState(left), sendAck("left");
  else if (cmd == "right") motorControl.setState(right), sendAck("right");
  else if (cmd == "spin") motorControl.setState(spin), sendAck("spin");
  else if (cmd == "stop") motorControl.setState(stopped), sendAck("stop");
  else if (cmd == "status") Serial.println("{\"status\":\"running\"}");
  else sendError("unknown_command");
}
