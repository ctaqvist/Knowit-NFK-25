#include "MotorControl.h"
#include "CommandHandler.h"

/**
 * @brief Initializes the system components.
 * 
 * This function is called once at the beginning of the program execution.
 * It performs the following initializations:
 * - Starts the serial communication at a baud rate of 115200.
 * - Initializes the motor control system.
 * - Initializes the command handler for processing commands.
 */
void setup()
{
  Serial.begin(115200);
  motorControl.init();
  commandHandler.init();
}

void loop()
{
  commandHandler.listen();
  motorControl.update();
  delay(50);
}