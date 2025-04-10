#include "battery_health_function.h"
//Constants
const int Buzzer_Pin = 13; //D13 är för att sätta på och stänga av LED
const int Motor_A = 2; //D2
const int Motor_B = 4; //D4
const int Motor_C = 7; //D7
const int Motor_D = 8; //D8
const int PWM_AB = 3; //D3
const int PWM_CD = 5; //D5 


void forward () {
  // Sätt riktning framåt för båda sidor
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  digitalWrite(Motor_C, HIGH);
  digitalWrite(Motor_D, LOW);

  // Sätt PWM till motorerna (valfritt värde, ex. 200 av max 255)
  analogWrite(PWM_AB, 200);
  analogWrite(PWM_CD, 200);

}


void stopMotors() {
  analogWrite(PWM_AB, 0);
  analogWrite(PWM_CD, 0);
}
void setup() {
  // put your setup code here, to run once:
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
  // put your main code here, to run repeatedly:

  
  checkBatteryAndWarn ();
  forward();
  delay(5000);
  stopMotors();
  while(true); //för att göra att allting endast körs en gång 
  
  
 
  
}

 