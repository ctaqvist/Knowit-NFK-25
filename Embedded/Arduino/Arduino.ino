#include "battery_health_function.h"
//Constants
const int Buzzer_Pin = 13; //D13 är för att sätta på och stänga av LED




void setup() {
  // put your setup code here, to run once:
  pinMode(Buzzer_Pin, OUTPUT);
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // put your main code here, to run repeatedly:

  
  checkBatteryAndWarn ();
  delay(1000);
  
 
  
}

 