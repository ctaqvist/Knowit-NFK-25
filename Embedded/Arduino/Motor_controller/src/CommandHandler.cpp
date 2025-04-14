#include "CommandHandler.h"
#include "MotorControl.h"
#include <ArduinoJson.h>

// Global variables to store incoming serial data
String inputString = "";
bool stringComplete = false;

// CommandHandler instance to manage incoming commands
CommandHandler commandHandler;

/**
 * Initializes the command handler.
 * Reserves memory for the input string and prints a ready message.
 */
void CommandHandler::init()
{
  inputString.reserve(200);
  Serial.println("READY");
}

/**
 * Listens to serial input and checks for completed messages (ending with newline).
 * When a message is complete, it triggers command handling.
 */
void CommandHandler::listen()
{
  while (Serial.available())
  {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n')
    {
      stringComplete = true;
    }
  }

  if (stringComplete)
  {
    inputString.trim(); // Remove leading/trailing whitespace

    if (inputString.length() > 0)
    {
      handleCommand(inputString); // Process the received command
    }

    inputString = "";
    stringComplete = false;
  }
}

/**
 * Attempts to parse the command as JSON. If it contains a "command" field,
 * that value is extracted and executed. Otherwise, treats the entire string
 * as a plain command.
 */
void handleCommand(String cmd)
{
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, cmd);

  if (!error && doc.containsKey("command"))
  {
    String jsonCmd = doc["command"];
    executePlainCommand(jsonCmd);
    return;
  }

  // Fallback to plain-text command if not valid JSON or no "command" key
  executePlainCommand(cmd);
}

/**
 * Executes a plain command string by mapping known commands to motor states.
 * Sends an acknowledgment or error back over Serial.
 */
void executePlainCommand(String cmd)
{
  if (cmd == "fwd")
  {
    motorControl.setState(forward);
    Serial.println("{\"ack\":\"fwd\"}");
  }
  else if (cmd == "bwd")
  {
    motorControl.setState(backward);
    Serial.println("{\"ack\":\"bwd\"}");
  }
  else if (cmd == "left")
  {
    motorControl.setState(left);
    Serial.println("{\"ack\":\"left\"}");
  }
  else if (cmd == "right")
  {
    motorControl.setState(right);
    Serial.println("{\"ack\":\"right\"}");
  }
  else if (cmd == "spin")
  {
    motorControl.setState(spin);
    Serial.println("{\"ack\":\"spin\"}");
  }
  else if (cmd == "stop")
  {
    motorControl.setState(stopped);
    Serial.println("{\"ack\":\"stop\"}");
  }
  else if (cmd == "status")
  {
    String status = motorControl.getStatus();
    Serial.print("{\"status\":\"");
    Serial.print(status);
    Serial.println("\"}");
  }
  else
  {
    Serial.println("{\"error\":\"unknown_command\"}");
  }
}
