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
  analogWrite(PWM_AB, 150);
  analogWrite(PWM_CD, 150);

}
void backward () {
  // Sätt riktning framåt för båda sidor
  digitalWrite(Motor_A, LOW);
  digitalWrite(Motor_B, HIGH);
  digitalWrite(Motor_C, LOW);
  digitalWrite(Motor_D, HIGH);

  // Sätt PWM till motorerna (valfritt värde, ex. 200 av max 255)
  analogWrite(PWM_AB, 150);
  analogWrite(PWM_CD, 150);

}
/* 
 * Funktionen för tankturn, allting ska vara hårdkodat här då det inte behövs något hastighet
*/
void tankTurn () {
  // Sätt riktning framåt för båda sidor
  // Grupp 1
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  // Grunpp 2
  digitalWrite(Motor_C, LOW);
  digitalWrite(Motor_D, HIGH);

  // Sätt PWM till motorerna (valfritt värde, ex. 200 av max 255)
  analogWrite(PWM_AB, 255);
  analogWrite(PWM_CD, 255);

}
// Funktion för att stoppa alla motorerna 
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
  // Koden som används för att testa kommunikationen med Servern
  /*if(Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim(); //för att ta bort alla mellanslag 

    if(command == "fwd") {
      forward();
    } else if (command == "stop") {
      stopMotors();
    } else if (command == "tt") {
      //tank turn 
      tankTurn();
    }
  }*/

  // Koden nedan används för att hårdkoda allting 
  forward();
  //checkBatteryAndWarn ();
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
  while(true); //för att göra att allting endast körs en gång   
}

 