#include "SpotLight.h"
#include <Arduino.h>
#include "../HardWareConfig.h"

// Funktion som sätter på SpotLights
void TurnSpotLightOn()
{
  digitalWrite(SPOTLIGHTS_PIN, HIGH);
}

// Funktion som stänger av SpotLights
void TurnSpotLightOff()
{
  digitalWrite(SPOTLIGHTS_PIN, LOW);
}
