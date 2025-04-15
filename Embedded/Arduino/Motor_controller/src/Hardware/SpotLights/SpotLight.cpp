#include "SpotLight.h"
#include <Arduino.h>

const int SpotLights_Pin = 12;

//Funktion som sätter på SpotLights
void Spotlight_On ()
{
  digitalWrite(SpotLights_Pin, HIGH);
}

//Funktion som stänger av SpotLights
void Spotlight_Off ()
{
  digitalWrite(SpotLights_Pin, LOW);
}