#include "CommandHandler.h"
#include "MotorControl.h"
#include <ArduinoJson.h>

String inputString = "";
bool stringComplete = false;

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

void handleCommand(String cmd) {
  // Försök tolka som JSON
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, cmd);

  if (!error && doc.containsKey("command")) {
    String jsonCmd = doc["command"];
    executePlainCommand(jsonCmd);
    return;
  }

  // Om inte JSON → tolka som vanligt textkommando
  executePlainCommand(cmd);
}

void executePlainCommand(String cmd) {
  if (cmd == "fwd") {
    motorControl.setState(forward);
    Serial.println("{\"ack\":\"fwd\"}");
  } else if (cmd == "bwd") {
    motorControl.setState(backward);
    Serial.println("{\"ack\":\"bwd\"}");
  } else if (cmd == "left") {
    motorControl.setState(left);
    Serial.println("{\"ack\":\"left\"}");
  } else if (cmd == "right") {
    motorControl.setState(right);
    Serial.println("{\"ack\":\"right\"}");
  } else if (cmd == "spin") {
    motorControl.setState(spin);
    Serial.println("{\"ack\":\"spin\"}");
  } else if (cmd == "stop") {
    motorControl.setState(stopped);
    Serial.println("{\"ack\":\"stop\"}");
  } else if (cmd == "status") {
    String status = motorControl.getStatus();
    Serial.print("{\"status\":\"");
    Serial.print(status);
    Serial.println("\"}");
  } else {
    Serial.println("{\"error\":\"unknown_command\"}");
  }
}
