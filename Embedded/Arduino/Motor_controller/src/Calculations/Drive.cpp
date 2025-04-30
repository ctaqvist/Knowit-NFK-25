#include <math.h>
#include "Drive.h"
#include <stdio.h>

#ifdef TEST_ENVIRONMENT
#include "MotorControllerMock.h"
#else
#include "Hardware/Motor/MotorController.h"
#endif

using namespace std;

// Konstant som används för att beräkna hastigheten till PWM
const int PWM_SCALE = 255;


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
    float leftSpeed = speed * (1.0f + (turn < 0.0f ? turn : 0.0f));
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
    float rightSpeed = speed * (1.0f - (turn > 0.0f ? turn : 0.0f));
    // Begränsar hastigheten till [-1, 1]
    rightSpeed = fmaxf(-1.0f, fminf(1.0f, rightSpeed));
    return rightSpeed;
}


DriveState Drive::GetState() {
    if (y > 0.0f) {
        return FORWARD;
    }
    else if (y < 0.0f) {
        return BACKWARD;
    }
    else if (y == 0.0f && x > 0.0f) {
        return TTR;
    }
    else if (y == 0.0f && x < 0.0f) {
        return TTL;
    }
    else {
        return STOPPED;
    }
}

void Drive::SetXY(float newX, float newY) {
    x = newX;
    y = newY;
}


/* Denna funktion kommer att kommunicera med MotorController för att styra Rovern 
   Olika funktioner kommer att anropas beroende på vilket state som returneras
   När state är TTR eller TTL, ska en egen funktion anropas som styr motorerna, där endast dir och current_speed skickas
   Om state är FORWARD eller BACKWARD, ska en annan funktion anropas som styr motorerna, där left_speed, right_speed samt dir skickas
   Om state är STOPPED, ska en annan funktion anropas som stoppar motorerna
*/
void Drive::ExecuteDriveLogic() {
    int currentSpeed = round(CalculateHypotenuse()* PWM_SCALE);
    int leftSpeed = round(CalculateLeftSpeedFunc()* PWM_SCALE);
    int rightSpeed = round(CalculateRightSpeedFunc()* PWM_SCALE);
    DriveState dir = GetState();
    //Serial.print("Current Speed: ");
    //Serial.print(currentSpeed);
    //Serial.print(" Left Speed: ");
    //Serial.print(leftSpeed);
    //Serial.print(" Right Speed: ");
    //Serial.println(rightSpeed);
    // Skriver ut states, beroende på x och y (for testing)
    switch (dir) {
        case FORWARD:
            //Serial.println("State: GO FWD");
            motorController.DriveForward(leftSpeed, rightSpeed);
            break;
        case BACKWARD:
            //Serial.println("State: GO BWD");
            motorController.DriveBackward(leftSpeed, rightSpeed);
            break;
        case TTR:
            //Serial.println("State: TTR");
            motorController.MakeTankTurnRight(currentSpeed);
            break;
        case TTL:
            //Serial.println("State: TTL");
            motorController.MakeTankTurnLeft(currentSpeed);
            break;
        default:
            //Serial.println("State: STOPPED");
            motorController.StopMotors();
            break;
    }
}
