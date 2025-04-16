#include "Motor.h"
//George
Motor::Motor(int in1, int in2, int pwm) {
  in1Pin = in1;
  in2Pin = in2;
  pwmPin = pwm;
  currentSpeed = 0;

  pinMode(in1Pin, OUTPUT);
  pinMode(in2Pin, OUTPUT);
  pinMode(pwmPin, OUTPUT);
}

void Motor::setSpeed(int speed) {
  currentSpeed = speed;

#if !SIMULATION_MODE
  if (speed > 0) {
    digitalWrite(in1Pin, HIGH);
    digitalWrite(in2Pin, LOW);
  } else if (speed < 0) {
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, HIGH);
    speed = -speed;
  } else {
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
  }

  analogWrite(pwmPin, constrain(speed, 0, 255));
#endif
}

void Motor::stop() {
#if !SIMULATION_MODE
  digitalWrite(in1Pin, LOW);
  digitalWrite(in2Pin, LOW);
  analogWrite(pwmPin, 0);
#endif
  currentSpeed = 0;
}

int Motor::getSpeed() {
  return currentSpeed;
}

String Motor::getDirection() {
  if (currentSpeed > 0) return "forward";
  else if (currentSpeed < 0) return "backward";
  else return "stopped";
}