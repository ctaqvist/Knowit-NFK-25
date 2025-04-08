#include "MotorControl.h"

MotorControl motorControl;

MotorControl::MotorControl()
  : leftMotor(2, 3, 5), rightMotor(4, 7, 6), currentState(stopped) {}

void MotorControl::init() {}

void MotorControl::setState(DriveState state) {
  currentState = state;
}

void MotorControl::setMotors(int leftSpeed, int rightSpeed) {
  leftMotor.setSpeed(leftSpeed);
  rightMotor.setSpeed(rightSpeed);
}

Motor& MotorControl::getLeftMotor() { return leftMotor; }
Motor& MotorControl::getRightMotor() { return rightMotor; }

void MotorControl::update() {
  switch (currentState) {
    case stopped: setMotors(0, 0); break;
    case forward: setMotors(200, 200); break;
    case backward: setMotors(-200, -200); break;
    case left: setMotors(-150, 150); break;
    case right: setMotors(150, -150); break;
    case spin: setMotors(255, -255); break;
  }
}