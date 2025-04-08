#include <Arduino.h>
#include "CommandHandler.h"
#include "MotorControl.h"

void setup() {
  Serial.begin(115200);
  motorControl.init();
  commandHandler.init();
}

void loop() {
  commandHandler.listen();
  motorControl.update();
  delay(50);
}