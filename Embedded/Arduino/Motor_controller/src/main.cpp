//#include "motorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
#include "Hardware/Battery/battery_health.h"
const int SpotLights_Pin = 12; // Pin for spotlights
const int Buzzer_Pin = 13; //Styr Buzzern som tillhör Battery Protection system
const int Motor_A = 2; //D2
const int Motor_B = 4; //D4
const int Motor_C = 7; //D7
const int Motor_D = 8; //D8
const int PWM_AB = 3; //D3
const int PWM_CD = 5; //D5 

//Test funktion medan jag bygger upp rovern

void forward() {
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  digitalWrite(Motor_C, HIGH);
  digitalWrite(Motor_D, LOW);
  analogWrite(PWM_AB, 255);
  analogWrite(PWM_CD, 255);
}

void stopMotors() {
  analogWrite(PWM_AB, 0);
  analogWrite(PWM_CD, 0);
}

void setup() {
  Serial.begin(115200);
  //motorControl.init();
  //commandHandler.init();
}

void loop() {
  //commandHandler.listen();
  //motorControl.update();
  CheckBatteryAndWarn ();
  delay(1000);
  forward();
  delay(1000);
  stopMotors();
  delay(1000);
}

