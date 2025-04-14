#include "MotorControl.h"
#include "CommandHandler.h"

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