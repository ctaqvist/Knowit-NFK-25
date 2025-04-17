#include "CommandHandler.h"
#include <ArduinoJson.h>

String inputString = "";
bool stringComplete = false;

void CommandHandler::init()
{
  inputString.reserve(200);
  Serial.println("{\"status\":\"READY\"}");
}

void CommandHandler::listen()
{
  while (Serial.available())
  {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n')
      stringComplete = true;
  }

  if (stringComplete)
  {
    inputString.trim();
    if (inputString.length() > 0)
      handleCommand(inputString);
    inputString = "";
    stringComplete = false;
  }
}

void CommandHandler::sendAck(const String &cmd)
{
  Serial.println("{\"ack\":\"" + cmd + "\"}");
}

void CommandHandler::sendError(const String &msg)
{
  Serial.println("{\"error\":\"" + msg + "\"}");
}

void CommandHandler::handleCommand(String cmd)
{
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, cmd);

  if (!error)
  {
    // Format 1: {"command": "steer", "x": ..., "y": ...}
    if (doc.containsKey("command"))
    {
      String jsonCmd = doc["command"];

      if (jsonCmd == "steer" && doc.containsKey("x") && doc.containsKey("y"))
      {
        float x = doc["x"];
        float y = doc["y"];
        // motorControl.steer(x, y);
        sendAck("steer_direct");
        return;
      }

      executePlainCommand(jsonCmd);
      return;
    }

    // Format 2: {"steer": {"x": ..., "y": ...}}
    if (doc.containsKey("steer"))
    {
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
