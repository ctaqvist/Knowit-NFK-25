#include "Hardware/MotorControl.h"
#include "Backend/CommandHandler.h"
#include "Backend/Communication.h"

void setup() {
  Serial.begin(115200);
  motorControl.init();
  commandHandler.init();
  initCommunication();     
  
}

void loop() {
  handleIncomingSerial();    
  commandHandler.listen();
  motorControl.update();
  delay(50);
}