#include <iostream>
#include <cmath>
#include "Drive.h"
#include <stdio.h>

using namespace std;

//Jockes

Drive::Drive(float x, float y) {
    this -> x = x;
    this -> y = y;
}

// Funktion som beräknar hypotenusan
// returnerar sqrt(x^2 + y^2)
float Drive::CalculateHypotenuse() {
    return ( sqrt( x * x + y * y ));
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
    if (y > 0 && x == 0)
        return FORWARD;
    else if (y < 0 && x == 0)
        return BACKWARD;
    else if (y == 0 && x > 0)
        return TTR;
    else if (y == 0 && x < 0)
        return TTL;
    else
        return STOPPED;
}

/* Denna funktion kommer att kommunicera med MotorController för att styra Rovern 
   Olika funktioner kommer att anropas beroende på vilket state som returneras
   När state är TTR eller TTL, ska en egen funktion anropas som styr motorerna, där endast dir och current_speed skickas
   Om state är FORWARD eller BACKWARD, ska en annan funktion anropas som styr motorerna, där left_speed, right_speed samt dir skickas
   Om state är STOPPED, ska en annan funktion anropas som stoppar motorerna
*/
void Drive::ExecuteDriveLogic() {
    float currentSpeed = CalculateHypotenuse();
    float leftSpeed = CalculateLeftSpeedFunc();
    float rightSpeed = CalculateRightSpeedFunc();
    DriveState dir = GetState();

    printf("Left Speed: %.2f, Right Speed: %.2f\n", leftSpeed, rightSpeed);

    // Skriver ut states, beroende på x och y (for testing)
    switch (dir) {
        case FORWARD:
            printf("State: GO FWD\n");
            // George (leftSpeed, rightSpeed, dir)
            break;
        case BACKWARD:
            printf("State: GO BWD\n");
            // George (leftSpeed, rightSpeed, dir)
            break;
        case TTR:
            printf("State: TTR\n");
            // George_TT (currentSpeed,dir)
            break;
        case TTL:
            printf("State: TTL\n");
            // George_TT (currentSpeed,dir)
            break;
        default:
            printf("State: STOPPED\n");
            // George_STOPP_PLS
            break;
        }
    // George (leftSpeed, rightSpeed, dir)
}

