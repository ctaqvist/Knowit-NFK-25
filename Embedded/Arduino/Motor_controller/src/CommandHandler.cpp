#include "CommandHandler.h"
#include "MotorControl.h"
#include <ArduinoJson.h>

// Buffer for incoming serial data
String inputString = "";
bool stringComplete = false;

// CommandHandler instance
CommandHandler commandHandler;

/**
 * @brief Initializes the command handler.
 */
void CommandHandler::init() {
  inputString.reserve(200);
  Serial.println("READY");
}

/**
 * @brief Listens for complete serial lines and triggers command handling.
 */
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

/**
 * @brief Sends a standard acknowledgment with the command name.
 * @param cmd Command string that was acknowledged.
 */
void sendAck(const String& cmd) {
  Serial.println("{\"ack\":\"" + cmd + "\"}");
}

/**
 * @brief Sends a standard error message.
 * @param msg Error message string.
 */
void sendError(const String& msg) {
  Serial.println("{\"error\":\"" + msg + "\"}");
}

/**
 * @brief Sends full motor status including direction and speed.
 */
void sendStatus(const String& leftDir, int leftSpeed, const String& rightDir, int rightSpeed) {
  StaticJsonDocument<200> doc;
  JsonObject status = doc.createNestedObject("status");
  status["left"]["dir"] = leftDir;
  status["left"]["speed"] = leftSpeed;
  status["right"]["dir"] = rightDir;
  status["right"]["speed"] = rightSpeed;
  serializeJson(doc, Serial);
  Serial.println();
}

/**
 * @brief Handles speed commands with floating-point values.
 * @param speed A float between 0.0 and 1.0.
 */
void handleSpeedCommand(float speed) {
  speed = constrain(speed, 0.0, 1.0);
  int pwm = int(speed * 255.0);
  motorControl.setMotors(pwm, pwm);
}

/**
 * @brief Parses and executes a JSON or plain-text command.
 * @param cmd The full command string.
 */
void handleCommand(String cmd) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, cmd);

  if (!error && doc.containsKey("command")) {
    String jsonCmd = doc["command"];

    if (jsonCmd == "set_speed" && doc.containsKey("value")) {
      float speed = doc["value"];
      handleSpeedCommand(speed);
      sendAck("set_speed");
      return;
    }

    executePlainCommand(jsonCmd);
    return;
  }

  // Fallback to plain-text command
  executePlainCommand(cmd);
}

/**
 * @brief Executes basic plain-text commands (non-JSON).
 * @param cmd Command string (e.g. "fwd", "status", etc.)
 */
void executePlainCommand(String cmd) {
  if (cmd == "fwd") {
    motorControl.setState(forward);
    sendAck("fwd");
  }
  else if (cmd == "bwd") {
    motorControl.setState(backward);
    sendAck("bwd");
  }
  else if (cmd == "left") {
    motorControl.setState(left);
    sendAck("left");
  }
  else if (cmd == "right") {
    motorControl.setState(right);
    sendAck("right");
  }
  else if (cmd == "spin") {
    motorControl.setState(spin);
    sendAck("spin");
  }
  else if (cmd == "stop") {
    motorControl.setState(stopped);
    sendAck("stop");
  }
  else if (cmd == "status") {
    sendStatus(
      motorControl.getLeftMotor().getDirection(),
      motorControl.getLeftMotor().getSpeed(),
      motorControl.getRightMotor().getDirection(),
      motorControl.getRightMotor().getSpeed()
    );
  }
  else {
    sendError("unknown_command");
  }
}


