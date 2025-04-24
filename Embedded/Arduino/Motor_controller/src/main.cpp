//#include "motorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
#include "Hardware/Battery/BatteryHealth.h"
const int SPOTLIGHTS_PIN = 12; // Pin for spotlights
const int BUZZER_PIN = 13; //Styr Buzzern som tillhör Battery Protection system
const int MOTOR_A = 2; //D2
const int MOTOR_B = 4; //D4
const int MOTOR_C = 7; //D7
const int MOTOR_D = 8; //D8
const int PWM_AB = 3; //D3
const int PWM_CD = 5; //D5 

//Test funktion medan jag bygger upp rovern
void forward() {
  digitalWrite(MOTOR_A, HIGH);
  digitalWrite(MOTOR_B, LOW);
  digitalWrite(MOTOR_C, HIGH);
  digitalWrite(MOTOR_D, LOW);
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

