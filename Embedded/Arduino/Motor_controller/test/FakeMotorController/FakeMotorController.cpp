#include "FakeMotorController.h"
#include <iostream>

// Global instans
MotorController motorController;

// Mock-metoder (du saknar dessa just nu)
void MotorController::DriveForward(int l, int r) {
    std::cout << "Mock: DriveForward\n";
}
void MotorController::DriveBackward(int l, int r) {
    std::cout << "Mock: DriveBackward\n";
}
void MotorController::MakeTankTurnLeft(int s) {
    std::cout << "Mock: TankLeft\n";
}
void MotorController::MakeTankTurnRight(int s) {
    std::cout << "Mock: TankRight\n";
}
void MotorController::StopMotors() {
    std::cout << "Mock: Stop\n";
}
