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
float Drive::left_speed_func() {
    return (( 1 - ( x + 1 ) / 2 ) * calculateHypotenuse() );
}

// Funktion som beräknar hastigheten för höger däck
float Drive::right_speed_func() {
    return ((( x + 1 ) / 2 ) * calculateHypotenuse() );
}

DriveState Drive::getState() {
    if (y == 1 && x == 0)
        return FORWARD;
    else if (y == -1 && x == 0)
        return BACKWARD;
    else if (y == 0 && x == 1)
        return TTL;
    else if (y == 0 && x == -1)
        return TTR;
    else
        return STOPPED;
}

void Drive::Algorithm() {
    float current_speed = calculateHypotenuse();
    float left_speed = left_speed_func();
    float right_speed = right_speed_func();
    DriveState dir = getState();
    // Skriver ut states, beroende på x och y (for testing)
    switch (dir) {
        case FORWARD:
            printf("State: GO FWD");
            break;
        case BACKWARD:
            printf("State: GO BWD");
            break;
        case TTR:
            printf("State: TTR");
            break;
        case TTL:
            printf("State: TTL");
            break;
        default:
            printf("State: STOPPED");
            break;
        }   
    // George (leftspeed, rightspeed, dir)
}

