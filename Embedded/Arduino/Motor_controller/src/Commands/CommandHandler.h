#ifndef COMMAND_HANDLER_H
#define COMMAND_HANDLER_H

#include <Arduino.h>

class CommandHandler {
  public:
    void init();
    void listen();

  private:
    void handleCommand(String cmd);
    void executePlainCommand(String cmd);
    void sendAck(const String& cmd);
    void sendError(const String& msg);
};

// Global instans som du använder i main.cpp
extern CommandHandler commandHandler;

#endif
