#ifndef DRIVE_H
#define DRIVE_H

#include <Arduino.h>
// Jockes

//TTL = Tankturn left, TTR = Tankturn right
enum DriveState {
    FORWARD,
    BACKWARD,
    TTL, 
    TTR,
    STOPPED
};

class Drive {
    private:
        float x;
        float y;

    public:
        Drive(float x, float y);
        float CalculateHypotenuse();
        float CalculateLeftSpeedFunc();
        float CalculateRightSpeedFunc();
        // Funktion som returnerar ett state baserat på x och y
        DriveState GetState();
        void ExecuteDriveLogic();
};

#endif