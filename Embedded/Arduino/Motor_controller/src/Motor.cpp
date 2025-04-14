#include "Motor.h"

/**
 * Constructor for the Motor class.
 * Initializes pin assignments and sets pin modes to OUTPUT.
 *
 * @param in1  Pin for direction control (1)
 * @param in2  Pin for direction control (2)
 * @param pwm  PWM pin to control speed
 */
Motor::Motor(int in1, int in2, int pwm)
{
  in1Pin = in1;
  in2Pin = in2;
  pwmPin = pwm;
  currentSpeed = 0;

  pinMode(in1Pin, OUTPUT);
  pinMode(in2Pin, OUTPUT);
  pinMode(pwmPin, OUTPUT);
}

/**
 * Sets the speed of the motor.
 * Handles direction and speed using H-bridge logic.
 *
 * @param speed An integer (-255 to 255), where negative values mean reverse.
 */
void Motor::setSpeed(int speed)
{
  currentSpeed = speed;

  // Skip hardware interaction if in simulation mode
#if !SIMULATION_MODE
  if (speed > 0)
  {
    // Forward
    digitalWrite(in1Pin, HIGH);
    digitalWrite(in2Pin, LOW);
  }
  else if (speed < 0)
  {
    // Backward
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, HIGH);
    speed = -speed; // Convert to positive for PWM
  }
  else
  {
    // Stop motor
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
  }

  // Set PWM signal to control speed (0–255)
  analogWrite(pwmPin, constrain(speed, 0, 255));
#endif
}

/**
 * Stops the motor by setting direction and speed to 0.
 */
void Motor::stop()
{
#if !SIMULATION_MODE
  digitalWrite(in1Pin, LOW);
  digitalWrite(in2Pin, LOW);
  analogWrite(pwmPin, 0);
#endif
  currentSpeed = 0;
}

/**
 * Returns the current speed of the motor.
 * @return int Current speed value (can be negative for reverse).
 */
int Motor::getSpeed()
{
  return currentSpeed;
}

/**
 * Returns the current direction of the motor as a string.
 * @return String "forward", "backward", or "stopped".
 */
String Motor::getDirection()
{
  if (currentSpeed > 0)
    return "forward";
  else if (currentSpeed < 0)
    return "backward";
  else
    return "stopped";
}
