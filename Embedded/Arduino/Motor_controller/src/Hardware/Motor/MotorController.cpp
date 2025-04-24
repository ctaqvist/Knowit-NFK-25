#include "MotorController.h"

MotorController::MotorController (int motorA, int motorB, int motorC, int motorD, int pwmAB, int pwmCD)
    : m_motorA(motorA), m_motorB(motorB), m_motorC(motorC), m_motorD(motorD), m_pwmAB(pwmAB), m_pwmCD(pwmCD) {
      pinMode(motorA, OUTPUT);
      pinMode(motorB, OUTPUT);
      pinMode(motorC, OUTPUT);
      pinMode(motorD, OUTPUT);
      pinMode(pwmAB, OUTPUT);
      pinMode(pwmCD, OUTPUT);
}

void MotorController::setSpeed (int pwmPin, int speed) {
  analogWrite(pwmPin, speed);  
}

void MotorController::setMotors (bool a, bool b, bool c, bool d, int pwmA, int pwmB) {
  digitalWrite(m_motorA, a);
  digitalWrite(m_motorB, b);
  digitalWrite(m_motorC, c);
  digitalWrite(m_motorD, d);
  setSpeed(m_pwmAB, pwmA);
  setSpeed(m_pwmCD, pwmB);
}

void MotorController::DriveForward(int leftSpeed, int rightSpeed) {
  setMotors(LOW, HIGH, LOW, HIGH, leftSpeed, rightSpeed);
}

void MotorController::DriveBackward(int leftSpeed, int rightSpeed) {
  setMotors(HIGH, LOW, HIGH, LOW, leftSpeed, rightSpeed);
}

void MotorController::MakeTankTurnLeft(int speed) {
  setMotors(HIGH, LOW, LOW, HIGH, speed, speed);
}

void MotorController::MakeTankTurnRight(int speed) {
  setMotors(LOW, HIGH, HIGH, LOW, speed, speed);
}

void MotorController::StopMotors() {
  setSpeed(m_pwmAB, 0);
  setSpeed(m_pwmCD, 0);
}