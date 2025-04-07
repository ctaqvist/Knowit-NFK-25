#include "MotorControl.h"

MotorControl motorControl;

void MotorControl::init() {
  // Initialization handled in Motor constructors
}

void MotorControl::setState(DriveState newState) {
  currentState = newState;
}

void MotorControl::update() {
  switch (currentState) {
    case stopped:
      motorLeft.setSpeed(0);
      motorRight.setSpeed(0);
      break;
    case forward:
      motorLeft.setSpeed(200);
      motorRight.setSpeed(200);
      break;
    case backward:
      motorLeft.setSpeed(-200);
      motorRight.setSpeed(-200);
      break;
    case left:
      motorLeft.setSpeed(-150);
      motorRight.setSpeed(150);
      break;
    case right:
      motorLeft.setSpeed(150);
      motorRight.setSpeed(-150);
      break;
    case spin:
      motorLeft.setSpeed(255);
      motorRight.setSpeed(-255);
      break;
  }
}

String MotorControl::getStatus() {
  String status = "STATUS: Left=";
  status += motorLeft.getDirection();
  status += "(" + String(motorLeft.getSpeed()) + ")";
  status += ", Right=";
  status += motorRight.getDirection();
  status += "(" + String(motorRight.getSpeed()) + ")";
  return status;
}
//hej