//#include "motorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
#include "Hardware/Battery/BatteryHealth.h"
#include "Hardware/Motor/MotorController.h"
#include "Calculations/Drive.h"

// Pin for spotlights
const int SPOTLIGHTS_PIN = 12; 

void setup() {
  Serial.begin(115200);
  pinMode(SPOTLIGHTS_PIN, OUTPUT);
  
  //motorControl.init();
  //commandHandler.init(); //används för att hantera kommandon
}

void loop() {
  //commandHandler.listen();
  //motorControl.update();
  //CheckBatteryAndWarn ();
  //delay(1000);

}

