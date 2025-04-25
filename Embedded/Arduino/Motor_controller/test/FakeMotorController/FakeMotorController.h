#pragma once

class MotorController {
public:
    void DriveForward(int l, int r);
    void DriveBackward(int l, int r);
    void MakeTankTurnLeft(int s);
    void MakeTankTurnRight(int s);
    void StopMotors();
};

extern MotorController motorController;
