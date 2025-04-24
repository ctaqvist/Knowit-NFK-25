#include "SpotLight.h"
#include <Arduino.h>

const int SPOTLIGHTS_PIN = 12;

//Funktion som sätter på SpotLights
void TurnSpotlightOn ()
{
  digitalWrite(SPOTLIGHTS_PIN, HIGH);
}

//Funktion som stänger av SpotLights
void TurnSpotLightOff ()
{
  digitalWrite( SPOTLIGHTS_PIN, LOW);
}