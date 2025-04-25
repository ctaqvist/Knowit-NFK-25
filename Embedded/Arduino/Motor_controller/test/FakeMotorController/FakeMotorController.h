#pragma once

#include <iostream>

class MotorController {
public:
    void DriveForward(int l, int r)  { std::cout << "Mock: DriveForward\n"; }
    void DriveBackward(int l, int r) { std::cout << "Mock: DriveBackward\n"; }
    void MakeTankTurnLeft(int s)     { std::cout << "Mock: TankLeft\n"; }
    void MakeTankTurnRight(int s)    { std::cout << "Mock: TankRight\n"; }
    void StopMotors()                { std::cout << "Mock: Stop\n"; }
};

extern MotorController motorController;
