#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

#include <Arduino.h>
#include "Motor.h"

enum DriveState {
  stopped,
  forward,
  backward,
  left,
  right,
  spin
};

class MotorControl {
  public:
    void init();
    void setState(DriveState newState);
    void update();
    String getStatus();

  private:
    DriveState currentState = stopped;
    Motor motorLeft = Motor(2, 3, 5);
    Motor motorRight = Motor(4, 7, 6);
};

extern MotorControl motorControl;

#endif