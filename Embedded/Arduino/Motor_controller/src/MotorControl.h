/**
 * @file MotorControl.h
 * @brief Header file for the MotorControl class, which manages the state and operation of two motors.
 *
 * This file defines the MotorControl class and its associated methods for controlling
 * the movement of a robot using two motors. It also defines the DriveState enumeration
 * to represent the various driving states.
 */

#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

#include <Arduino.h>
#include "Motor.h"

enum DriveState
{
  stopped,
  forward,
  backward,
  left,
  right,
  spin
};

/**
 * @class MotorControl
 * @brief A class to control the state and operation of motors.
 *
 * This class provides methods to initialize, update, and manage the state
 * of a motor control system. It encapsulates the functionality for controlling
 * two motors and their states.
 */
class MotorControl
{
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