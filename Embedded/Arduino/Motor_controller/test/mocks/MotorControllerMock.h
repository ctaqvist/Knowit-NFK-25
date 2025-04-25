#ifndef MOTOR_CONTROLLER_MOCK_H
#define MOTOR_CONTROLLER_MOCK_H

#include <iostream>

class MotorController {
public:
    MotorController () {}
    void DriveForward(int leftSpeed, int rightSpeed) {
        std::cout << "Mock DriveForward: " << leftSpeed << ", " << rightSpeed << std::endl;
    }
    void DriveBackward(int leftSpeed, int rightSpeed) {
        std::cout << "Mock DriveBackward: " << leftSpeed << ", " << rightSpeed << std::endl;
    }
    void MakeTankTurnLeft(int speed) {
        std::cout << "Mock TankTurnLeft: " << speed << std::endl;
    }
    void MakeTankTurnRight(int speed) {
        std::cout << "Mock TankTurnRight: " << speed << std::endl;
    }
    void StopMotors() {
        std::cout << "Mock StopMotors\n";
    }
};

#endif
