//#include "motorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
#include "Hardware/Battery/BatteryHealth.h"
#include "Hardware/Motor/MotorController.h"
#include "Calculations/Drive.h"
#include "Hardware/SpotLights/SpotLight.h"

// Pin for spotlights
const int SPOTLIGHTS_PIN = 12; 


Drive drive (0.0f, 0.0f); // Skapa en Drive-instans med x och y som 0.0f
void setup() {
  Serial.begin(9600);
  pinMode(SPOTLIGHTS_PIN, OUTPUT); 
  //commandHandler.init(); 
}


void loop() {
  //commandHandler.listen();
  //motorControl.update();
  //delay(1000);
  drive.SetXY(1.0f, 0.0f); // Sätt x och y till 0.0f och 1.0f
  // att skapa en Drive-instans med x och y
  drive.ExecuteDriveLogic(); // Anropa funktionen för att köra logiken
  
  delay(1000); // Håll framåt i 1 sekund
}

