#include "MotorControl.h"

MotorControl motorControl;

void MotorControl::init()
{
  // Initialization handled in Motor constructors
}

void MotorControl::setState(DriveState newState)
{
  currentState = newState;
}

/**
 * @brief Updates the motor speeds based on the current state of the motor controller.
 *
 * This function adjusts the speed and direction of the left and right motors
 * according to the current state of the motor controller. The possible states
 * and their corresponding motor behaviors are:
 *
 * - `stopped`: Both motors are stopped (speed set to 0).
 * - `forward`: Both motors move forward at a speed of 200.
 * - `backward`: Both motors move backward at a speed of -200.
 * - `left`: The left motor moves backward at a speed of -150, and the right motor
 *   moves forward at a speed of 150, causing the system to turn left.
 * - `right`: The left motor moves forward at a speed of 150, and the right motor
 *   moves backward at a speed of -150, causing the system to turn right.
 * - `spin`: The left motor moves forward at maximum speed (255), and the right
 *   motor moves backward at maximum speed (-255), causing the system to spin in place.
 *
 * @note Ensure that the `currentState` variable is set appropriately before calling
 * this function to achieve the desired motor behavior.
 */
void MotorControl::update()
{
  switch (currentState)
  {
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

String MotorControl::getStatus()
{
  String status = "STATUS: Left=";
  status += motorLeft.getDirection();
  status += "(" + String(motorLeft.getSpeed()) + ")";
  status += ", Right=";
  status += motorRight.getDirection();
  status += "(" + String(motorRight.getSpeed()) + ")";
  return status;
}