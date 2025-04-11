#ifndef MOTOR_H
#define MOTOR_H

#include <Arduino.h>

class Motor {
  private:
    int in1Pin;
    int in2Pin;
    int pwmPin;
    int currentSpeed;

  public:
    Motor(int in1, int in2, int pwm);
    void setSpeed(int speed);
    void stop();
    int getSpeed();
    String getDirection();
};

#endif