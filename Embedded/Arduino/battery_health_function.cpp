#include "battery_health_function.h"
#include <Arduino.h>

/*
  * Function for battery health. 
  * analogPin - Number of the pin to read the battery voltage level
  * Vref of the Micro controller
*/
const float R1 = 20000.0;
const float R2 = 10000.0;

float BatteryHealth(int analogPin, float Vref) {
  int rawADC = analogRead(analogPin); //Läser av det analoga Pinnen
  float voltage= (rawADC * Vref) / 1023.0; //0-1023 (10 bitars)
  float batteryVoltage= voltage * ((R1 + R2)/R2);

  //Ger batteri nivån
  return batteryVoltage;

}
