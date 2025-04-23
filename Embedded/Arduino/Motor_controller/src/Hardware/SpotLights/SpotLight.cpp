#include "SpotLight.h"
#include <Arduino.h>

const int SpotLights_Pin = 12;

//Funktion som sätter på SpotLights
void TurnSpotlightOn ()
{
  digitalWrite(SpotLights_Pin, HIGH);
}

//Funktion som stänger av SpotLights
void TurnSpotLightOff ()
{
  digitalWrite(SpotLights_Pin, LOW);
}