#include "Arduino.h"
#include "Backend/CommandHandler.h"
#include "Hardware/Battery/BatteryHealth.h"
#include "Hardware/Motor/MotorController.h"
#include "Calculations/Drive.h"

// Pin for spotlights
const int SPOTLIGHTS_PIN = 12; 

void setup() {
  Serial.begin(9600);
  pinMode(SPOTLIGHTS_PIN, OUTPUT);
  
  commandHandler.init();  //  Initiera CommandHandler så Arduino är redo att ta emot JSON-kommandon
  //motorControl.init();   // (om du vill, motorinitiering kan vara kvar)
}

void loop() {
  commandHandler.listen();  //  Viktigt! Så Arduino hela tiden lyssnar på Serial
  //motorControl.update();   // (kan vara kvar om du vill)
  //CheckBatteryAndWarn();   // (kan vara kvar om du vill)
  //delay(1000);             // (valfritt)
}
