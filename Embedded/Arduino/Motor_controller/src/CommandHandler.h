#ifndef COMMAND_HANDLER_H
#define COMMAND_HANDLER_H
#include <Arduino.h>

/**
 * @class CommandHandler
 * @brief Handles command initialization and listening for incoming commands.
 *
 * The CommandHandler class provides methods to initialize the command handling
 * system and to listen for and process incoming commands.
 */
class CommandHandler
{
public:
  void init();
  void listen();
};

extern CommandHandler commandHandler;

void handleCommand(String cmd);
void executePlainCommand(String cmd);

#endif
