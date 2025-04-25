//#include <iostream>
#include <math.h>
#include "Drive.h"
#include <stdio.h>
#include "Hardware/Motor/MotorController.h"

using namespace std;

// Hämtar globala instansen av MotorController
extern MotorController motorController;

Drive::Drive(float x, float y) {
    this -> x = x;
    this -> y = y;
}

// Funktion som beräknar hypotenusan
// returnerar sqrt(x^2 + y^2)
float Drive::CalculateHypotenuse() {
    return (sqrt( x * x + y * y ));
}

// Funktion som beräknar hastigheten för vänster däck
float Drive::CalculateLeftSpeedFunc() {
    float speed = y;
    float turn = x;
    // Ju mer till vänster man styr, desto saktare roterar vänster däck
    // if turn < 0 (styr vänster)
    // left_speed = speed * (1.0 - turn)
    float leftSpeed = speed * (1.0f + (turn < 0 ? turn : 0));
    // Begränsar hastigheten till [-1, 1]
    leftSpeed = fmaxf(-1.0f, fminf(1.0f, leftSpeed));
    return leftSpeed;
}

// Funktion som beräknar hastigheten för höger däck
float Drive::CalculateRightSpeedFunc() {
    float speed = y;
    float turn = x;
    // Ju mer till höger man styr, desto saktare roterar höger däck
    // if turn < 0 (styr höger)
    // right_speed = speed * (1.0 - turn)
    float rightSpeed = speed * (1.0f - (turn > 0 ? turn : 0));
    // Begränsar hastigheten till [-1, 1]
    rightSpeed = fmaxf(-1.0f, fminf(1.0f, rightSpeed));
    return rightSpeed;
}

DriveState Drive::GetState() {
    if (y > 0 && x == 0) {
        return FORWARD;
    }
    else if (y < 0 && x == 0) {
        return BACKWARD;
    }
    else if (y == 0 && x > 0) {
        return TTR;
    }
    else if (y == 0 && x < 0) {
        return TTL;
    }
    else {
        return STOPPED;
    }
}

/* Denna funktion kommer att kommunicera med MotorController för att styra Rovern 
   Olika funktioner kommer att anropas beroende på vilket state som returneras
   När state är TTR eller TTL, ska en egen funktion anropas som styr motorerna, där endast dir och current_speed skickas
   Om state är FORWARD eller BACKWARD, ska en annan funktion anropas som styr motorerna, där left_speed, right_speed samt dir skickas
   Om state är STOPPED, ska en annan funktion anropas som stoppar motorerna
*/
void Drive::ExecuteDriveLogic() {
    int currentSpeed = round(CalculateHypotenuse());
    int leftSpeed = round(CalculateLeftSpeedFunc());
    int rightSpeed = round(CalculateRightSpeedFunc());
    DriveState dir = GetState();
    printf("Left Speed: %d, Right Speed: %d\n", leftSpeed, rightSpeed);
    // Skriver ut states, beroende på x och y (for testing)
    switch (dir) {
        case FORWARD:
            printf("State: GO FWD\n");
            motorController.DriveForward(leftSpeed, rightSpeed);
            break;
        case BACKWARD:
            printf("State: GO BWD\n");
            motorController.DriveBackward(leftSpeed, rightSpeed);
            break;
        case TTR:
            printf("State: TTR\n");
            motorController.MakeTankTurnRight(currentSpeed);
            break;
        case TTL:
            printf("State: TTL\n");
            motorController.MakeTankTurnLeft(currentSpeed);
            break;
        default:
            printf("State: STOPPED\n");
            motorController.StopMotors();
            break;
    }
}
