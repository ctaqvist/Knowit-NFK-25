#include "MotorController.h"
#include "../HardWareConfig.h"


// Golabal instans av MotorController
MotorController motorController;

// Definiera motorernas styrpinnar
MotorController::MotorController() {
  pinMode(MOTOR_A, OUTPUT);
  pinMode(MOTOR_B, OUTPUT);
  pinMode(MOTOR_C, OUTPUT);
  pinMode(MOTOR_D, OUTPUT);
  pinMode(PWM_AB, OUTPUT);
  pinMode(PWM_CD, OUTPUT);
}

// Funktion för att sätta hastigheten på motorerna
void MotorController::setSpeed(int pwmPin, int speed) {
  analogWrite(pwmPin, speed);
}

// Funktion för att sätta motorerna till ett visst läge
void MotorController::setMotors(bool a, bool b, bool c, bool d, int pwmA, int pwmB) {
  digitalWrite(MOTOR_A, a);
  digitalWrite(MOTOR_B, b);
  digitalWrite(MOTOR_C, c);
  digitalWrite(MOTOR_D, d);
  setSpeed(PWM_AB, pwmA);
  setSpeed(PWM_CD, pwmB);
}

// Funktion för att köra framåt med hastighet från användaren
void MotorController::DriveForward(int leftSpeed, int rightSpeed) {
  setMotors(LOW, HIGH, LOW, HIGH, leftSpeed, rightSpeed);
}

// Funktion för att köra bakåt med hastighet från användaren
void MotorController::DriveBackward(int leftSpeed, int rightSpeed) {
  setMotors(HIGH, LOW, HIGH, LOW, leftSpeed, rightSpeed);
}

// Funktion för att göra en tankturn till vänster med hastighet från användaren
void MotorController::MakeTankTurnLeft(int speed) {
  setMotors(HIGH, LOW, LOW, HIGH, speed, speed);
}

// Funktion för att göra en tankturn till höger med hastighet från användaren
void MotorController::MakeTankTurnRight(int speed) {
  setMotors(LOW, HIGH, HIGH, LOW, speed, speed);
}

// Funktion för att stoppa motorerna
void MotorController::StopMotors() {
  setSpeed(PWM_AB, 0);
  setSpeed(PWM_CD, 0);
}