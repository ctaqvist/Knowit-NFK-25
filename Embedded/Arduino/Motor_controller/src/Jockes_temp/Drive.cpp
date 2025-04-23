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
float Drive::calculateHypotenuse() {
    return ( sqrt( x * x + y * y ));
}

// Funktion som beräknar hastigheten för vänster däck
float Drive::leftSpeedFunc() {
    float speed = y;
    float turn = x;

    // Ju mer till vänster man styr, desto saktare roterar vänster däck
    // if turn < 0 (styr vänster)
    // left_speed = speed * (1.0 - turn)
    float left_speed = speed * (1.0f + (turn < 0 ? turn : 0));

    // Begränsar hastigheten till [-1, 1]
    left_speed = fmaxf(-1.0f, fminf(1.0f, left_speed));
    return left_speed;
}

// Funktion som beräknar hastigheten för höger däck
float Drive::rightSpeedFunc() {
    float speed = y;
    float turn = x;

    // Ju mer till höger man styr, desto saktare roterar höger däck
    // if turn < 0 (styr höger)
    // right_speed = speed * (1.0 - turn)
    float right_speed = speed * (1.0f - (turn > 0 ? turn : 0));

    // Begränsar hastigheten till [-1, 1]
    right_speed = fmaxf(-1.0f, fminf(1.0f, right_speed));
    return right_speed;
}

DriveState Drive::getState() {
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
void Drive::algorithm() {
    float current_speed = calculateHypotenuse();
    float left_speed = leftSpeedFunc();
    float right_speed = rightSpeedFunc();
    DriveState dir = getState();

    printf("Left Speed: %.2f, Right Speed: %.2f\n", left_speed, right_speed);

    // Skriver ut states, beroende på x och y (for testing)
    switch (dir) {
        case FORWARD:
            printf("State: GO FWD\n");
            // George (leftspeed, rightspeed, dir)
            break;
        case BACKWARD:
            printf("State: GO BWD\n");
            // George (leftspeed, rightspeed, dir)
            break;
        case TTR:
            printf("State: TTR\n");
            // George_TT (current_speed,dir)
            break;
        case TTL:
            printf("State: TTL\n");
            // George_TT (current_speed,dir)
            break;
        default:
            printf("State: STOPPED\n");
            // George_STOPP_PLS
            break;
    }
    // George (leftspeed, rightspeed, dir)
}
