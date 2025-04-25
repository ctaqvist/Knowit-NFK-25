#ifndef MOTOR_CONTROLLER_MOCK_H
#define MOTOR_CONTROLLER_MOCK_H

#include <iostream>

// En fake MotorController som bara loggar anrop
class MotorController {
  public:
    MotorController() {}
    void DriveForward(int leftSpeed, int rightSpeed) {
        std::cout << "Mock DriveForward called\n";
    }
    void DriveBackward(int leftSpeed, int rightSpeed) {
        std::cout << "Mock DriveBackward called\n";
    }
    void MakeTankTurnLeft(int speed) {
        std::cout << "Mock MakeTankTurnLeft called\n";
    }
    void MakeTankTurnRight(int speed) {
        std::cout << "Mock MakeTankTurnRight called\n";
    }
    void StopMotors() {
        std::cout << "Mock StopMotors called\n";
    }
};

#endif // MOTOR_CONTROLLER_MOCK_H
