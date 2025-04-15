//#include "MotorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
const int SpotLights_Pin = 12; // Pin for spotlights
const int Buzzer_Pin = 13; //Styr Buzzern som tillhör Battery Protection system
const int Motor_A = 2; //D2
const int Motor_B = 4; //D4
const int Motor_C = 7; //D7
const int Motor_D = 8; //D8
const int PWM_AB = 3; //D3
const int PWM_CD = 5; //D5 

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