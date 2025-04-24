//#include "motorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
#include "Hardware/Battery/BatteryHealth.h"
#include "Hardware/Motor/MotorController.h"
#include "Calculations/Drive.h"

// Pin Definitioner
// Pin for spotlights
const int SPOTLIGHTS_PIN = 12; 
// D2
const int MOTOR_A = 2;
// D4 
const int MOTOR_B = 4;
// D7 
const int MOTOR_C = 7;
// D8
const int MOTOR_D = 8;
// D3 
const int PWM_AB = 3; 
// D5
const int PWM_CD = 5;  

// Golobal objekt
MotorController motorController(MOTOR_A, MOTOR_B, MOTOR_C, MOTOR_D, PWM_AB, PWM_CD);
//Skapar ett Drive-objekt som använder motorController
Drive drive(motorController);



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

