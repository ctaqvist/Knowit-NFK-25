#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

#include <Arduino.h>

//George

class MotorController {
  public:
    MotorController (int motorA, int motorB, int motorC, int motorD, int pwmAB, int pwmCD);

    void DriveForward(int leftSpeed, int rightSpeed);
    void DriveBackward(int leftSpeed, int rightSpeed);
    void MakeTankTurnLeft(int speed);
    void MakeTankTurnRight(int speed);
    void StopMotors();
  
    private:
      int m_motorA;
      int m_motorB;
      int m_motorC;
      int m_motorD;
      int m_pwmAB;
      int m_pwmCD;

      void setMotors (bool a, bool b, bool c, bool d, int pwmA, int pwmB);
      void setSpeed (int pwmPin, int speed);
};


#endif