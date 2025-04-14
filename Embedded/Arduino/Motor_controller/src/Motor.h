#ifndef MOTOR_H
#define MOTOR_H

#include <Arduino.h>

/**
 * @class Motor
 * @brief A class to control a single DC motor using an H-bridge.
 *
 * This class provides an interface for setting motor speed, direction,
 * stopping the motor, and retrieving its current state.
 */
class Motor
{
private:
  int in1Pin;       // Control pin 1 for motor direction
  int in2Pin;       // Control pin 2 for motor direction
  int pwmPin;       // PWM pin for motor speed
  int currentSpeed; // Current speed value (negative for reverse)

public:
  /**
   * @brief Constructor to initialize motor control pins.
   * @param in1  Direction control pin 1
   * @param in2  Direction control pin 2
   * @param pwm  PWM pin for speed control
   */
  Motor(int in1, int in2, int pwm);

  /**
   * @brief Set motor speed and direction.
   * @param speed Speed value (-255 to 255)
   */
  void setSpeed(int speed);

  /**
   * @brief Stop the motor (sets speed to 0).
   */
  void stop();

  /**
   * @brief Get the current speed of the motor.
   * @return Current speed value
   */
  int getSpeed();

  /**
   * @brief Get a textual representation of the motor's direction.
   * @return "forward", "backward", or "stopped"
   */
  String getDirection();
};

#endif
