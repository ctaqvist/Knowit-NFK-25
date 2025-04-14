#include "MotorControl.h"

// Global instance
MotorControl motorControl;

/**
 * @brief Initializes the motor control system.
 * 
 * Currently empty, as individual motors handle their own setup.
 */
void MotorControl::init() {
  // Reserved for future use if initialization is needed
}

/**
 * @brief Sets the current drive state (e.g. forward, spin, stopped).
 * 
 * @param newState Desired drive mode.
 */
void MotorControl::setState(DriveState newState) {
  currentState = newState;
}

/**
 * @brief Directly sets motor speeds in PWM values.
 * 
 * @param leftSpeed Speed for left motor (-255 to 255)
 * @param rightSpeed Speed for right motor (-255 to 255)
 */
void MotorControl::setMotors(int leftSpeed, int rightSpeed) {
  motorLeft.setSpeed(leftSpeed);
  motorRight.setSpeed(rightSpeed);
}

/**
 * @brief Applies the current drive state to the motors.
 * 
 * This function updates motor speed/direction based on currentState:
 * - `stopped`: Both motors stop.
 * - `forward`: Both motors move forward.
 * - `backward`: Both motors move backward.
 * - `left`: Left motor reverse, right motor forward.
 * - `right`: Left motor forward, right motor reverse.
 * - `spin`: Opposite directions at full speed for rotation.
 */
void MotorControl::update() {
  switch (currentState) {
    case stopped:
      setMotors(0, 0);
      break;
    case forward:
      setMotors(200, 200);
      break;
    case backward:
      setMotors(-200, -200);
      break;
    case left:
      setMotors(-150, 150);
      break;
    case right:
      setMotors(150, -150);
      break;
    case spin:
      setMotors(255, -255);
      break;
  }
}

/**
 * @brief Returns a status summary string of both motors.
 * 
 * @return Formatted string with direction and speed.
 */
String MotorControl::getStatus() {
  return "Left: " + motorLeft.getDirection() + "(" + motorLeft.getSpeed() + "), " +
         "Right: " + motorRight.getDirection() + "(" + motorRight.getSpeed() + ")";
}

/**
 * @brief Returns a reference to the left motor.
 * @return Reference to Motor object.
 */
Motor& MotorControl::getLeftMotor() {
  return motorLeft;
}

/**
 * @brief Returns a reference to the right motor.
 * @return Reference to Motor object.
 */
Motor& MotorControl::getRightMotor() {
  return motorRight;
}
