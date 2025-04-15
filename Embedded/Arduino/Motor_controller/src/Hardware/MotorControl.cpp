#include "MotorControl.h"
//George
MotorControl motorControl;

void MotorControl::init() {
  // Initfunktion om du behöver något i framtiden
}

void MotorControl::setState(DriveState state) {
  currentState = state;
}

void MotorControl::setMotors(int leftSpeed, int rightSpeed) {
  motorLeft.setSpeed(leftSpeed);
  motorRight.setSpeed(rightSpeed);
}

void MotorControl::update() {
  switch (currentState) {
    case stopped:  setMotors(0, 0); break;
    case forward:  setMotors(200, 200); break;
    case backward: setMotors(-200, -200); break;
    case left:     setMotors(-150, 150); break;
    case right:    setMotors(150, -150); break;
    case spin:     setMotors(255, -255); break;
  }
}

String MotorControl::getStatus() {
  return "Left: " + motorLeft.getDirection() + "(" + motorLeft.getSpeed() + "), " +
         "Right: " + motorRight.getDirection() + "(" + motorRight.getSpeed() + ")";
}
