#include "battery_health_function.h"
#include "spotLight_functions.h"

//Constants
const int Buzzer_Pin = 13; //Styr Buzzern som tillhör Battery Protection system
const int Motor_A = 2; //D2
const int Motor_B = 4; //D4
const int Motor_C = 7; //D7
const int Motor_D = 8; //D8
const int PWM_AB = 3; //D3
const int PWM_CD = 5; //D5 
const int SpotLights_Pin = 12; // Sätter på och av spotlights

void forward () {
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  digitalWrite(Motor_C, HIGH);
  digitalWrite(Motor_D, LOW);
  analogWrite(PWM_AB, 150);
  analogWrite(PWM_CD, 150);
}

void backward () {
  digitalWrite(Motor_A, LOW);
  digitalWrite(Motor_B, HIGH);
  digitalWrite(Motor_C, LOW);
  digitalWrite(Motor_D, HIGH);
  analogWrite(PWM_AB, 150);
  analogWrite(PWM_CD, 150);
}

void tankTurn () {
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  digitalWrite(Motor_C, LOW);
  digitalWrite(Motor_D, HIGH);
  analogWrite(PWM_AB, 255);
  analogWrite(PWM_CD, 255);
}

void stopMotors() {
  analogWrite(PWM_AB, 0);
  analogWrite(PWM_CD, 0);
}

void setup() {
  pinMode(SpotLights_Pin, OUTPUT);
  pinMode(Buzzer_Pin, OUTPUT);
  pinMode(Motor_A, OUTPUT);
  pinMode(Motor_B, OUTPUT);
  pinMode(Motor_C, OUTPUT);
  pinMode(Motor_D, OUTPUT);
  pinMode(PWM_AB, OUTPUT);
  pinMode(PWM_CD, OUTPUT);
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // Testkör motorer
  forward();
  delay(3000);
  stopMotors();
  delay(2000);

  backward();
  delay(3000);
  stopMotors();
  delay(2000);

  tankTurn();
  delay(1500);
  stopMotors();

  // Slå på och av spotlight, kontrollera batteri
  Spotlight_On();
  delay(1000);
  Spotlight_Off();
  checkBatteryAndWarn ();
  delay(1000);

  while(true); // Kör bara en gång
}
