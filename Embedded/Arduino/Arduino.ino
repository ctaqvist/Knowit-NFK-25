#include "battery_health_function.h"
//Constants
const int Buzzer_Pin = 13; //Styr Buzzern som tillhör Battery Protection system
const int SpotLights_Pin = 12; //Sätter på och av spotlights




void setup() {
  // put your setup code here, to run once:
  pinMode(SpotLights_Pin, OUTPUT);
  pinMode(Buzzer_Pin, OUTPUT);
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // put your main code here, to run repeatedly:

  Spotlight_On();
  delay(1000);
  Spotlight_Off();
  checkBatteryAndWarn ();
  delay(1000);
  
 
  
}
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