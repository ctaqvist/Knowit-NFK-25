#include <Arduino.h>
#ifndef COMMAND_HANDLER_H
#define COMMAND_HANDLER_H


class CommandHandler {
public:
    void init();
    void listen();
};

// Global instans så att du kan använda commandHandler.init() och commandHandler.listen()
extern CommandHandler commandHandler;

// Deklaration av intern funktion (används bara i .cpp)
void handleCommand(const String& cmd);

#endif
