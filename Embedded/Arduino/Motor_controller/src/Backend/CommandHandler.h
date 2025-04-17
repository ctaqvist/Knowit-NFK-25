#ifndef COMMAND_HANDLER_H
#define COMMAND_HANDLER_H

#include <Arduino.h>

class CommandHandler {
  public:
    void init();
    void listen();
};

// Skapar en global instans så du kan använda `commandHandler.init()` och `commandHandler.listen()` i din sketch
extern CommandHandler commandHandler;

// Dessa deklareras i .cpp men används bara internt
void handleCommand(String cmd);
void executePlainCommand(String cmd);

#endif
