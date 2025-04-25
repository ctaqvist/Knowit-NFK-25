#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

#include <Arduino.h>

//George

class MotorController {
  public:
    MotorController ();
    void DriveForward(int leftSpeed, int rightSpeed);
    void DriveBackward(int leftSpeed, int rightSpeed);
    void MakeTankTurnLeft(int speed);
    void MakeTankTurnRight(int speed);
    void StopMotors();
  
    private:
      void setMotors (bool a, bool b, bool c, bool d, int pwmA, int pwmB);
      void setSpeed (int pwmPin, int speed);
};


#endif