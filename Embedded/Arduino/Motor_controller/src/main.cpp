//#include "motorControl.h"
//#include "CommandHandler.h"
#include "Arduino.h"
#include "Hardware/Battery/BatteryHealth.h"
#include "Hardware/Motor/MotorController.h"
#include "Calculations/Drive.h"

// Pin for spotlights
const int SPOTLIGHTS_PIN = 12; 
// boooort
const int Motor_A = 2; //D2
const int Motor_B = 4; //D4
const int Motor_C = 7; //D7
const int Motor_D = 8; //D8
const int PWM_AB = 3; //D3
const int PWM_CD = 5; //D5 

void driveForward() {
  digitalWrite(Motor_A, LOW);
  digitalWrite(Motor_B, HIGH);
  digitalWrite(Motor_C, LOW);
  digitalWrite(Motor_D, HIGH);
  analogWrite(PWM_AB, 255);
  analogWrite(PWM_CD, 255);
}

void driveBackware() {
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  digitalWrite(Motor_C, HIGH);
  digitalWrite(Motor_D, LOW);
  analogWrite(PWM_AB, 255);
  analogWrite(PWM_CD, 255);
}

void driveTankTurnLeft () {
  
  digitalWrite(Motor_A, HIGH);
  digitalWrite(Motor_B, LOW);
  digitalWrite(Motor_C, LOW);
  digitalWrite(Motor_D, HIGH);
  analogWrite(PWM_AB, 255);
  analogWrite(PWM_CD, 255);
  
}

void driveTankTurnRight() {
  digitalWrite(Motor_A, LOW);
  digitalWrite(Motor_B, HIGH);
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
  Serial.begin(9600);
  pinMode(SPOTLIGHTS_PIN, OUTPUT);
  pinMode(Motor_A, OUTPUT);
  pinMode(Motor_B, OUTPUT);
  pinMode(Motor_C, OUTPUT);
  pinMode(Motor_D, OUTPUT);
  pinMode(PWM_AB, OUTPUT);
  pinMode(PWM_CD, OUTPUT);
  //motorControl.init();
  //commandHandler.init(); //används för att hantera kommandon
}

void loop() {
  //commandHandler.listen();
  //motorControl.update();
  //delay(1000);

  // Detta kommer att användas för att styra rovern under demo
  if(Serial.available()) {
    char command = Serial.read();
    switch(command) {
      case 'fwd': // Framåt
        driveForward();
        break;
      case 'bwd': // Bakåt
        driveBackware();
        break;
      case 'stop': // Stanna
        stopMotors();
        break;
      case 'TTL':
        driveTankTurnLeft();
        break;
      case 'TTR':
        driveTankTurnRight();
        break;
      default:
        break;
    }
  }


}

