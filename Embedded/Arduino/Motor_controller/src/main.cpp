//#include "MotorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
const int SpotLights_Pin = 12; // Pin for spotlights

void setup() {
  Serial.begin(115200);
  //motorControl.init();
  //commandHandler.init();
  pinMode(SpotLights_Pin, OUTPUT);
}

void loop() {
  //commandHandler.listen();
  //motorControl.update();
  digitalWrite(SpotLights_Pin, HIGH); // Turn on spotlights
  delay(1000); // Wait for 1 second
  digitalWrite(SpotLights_Pin, LOW); // Turn off spotlights
  delay(1000); // Wait for 1 second
  delay(50);
}