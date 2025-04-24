#include "spotlight.h"
#include <Arduino.h>

const int SpotLights_Pin = 12;

//Funktion som sätter på SpotLights
void spotlightOn ()
{
  digitalWrite(SpotLights_Pin, HIGH);
}

//Funktion som stänger av SpotLights
void spotlightOff ()
{
  digitalWrite(SpotLights_Pin, LOW);
}