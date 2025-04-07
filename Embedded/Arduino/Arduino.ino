#include "battery_health_function.h"
//Constants
const float Vref = 5.0;
const float  battery_limit = 8.0; //Innna man får en varning
const int Buzzer_Pin = 13; //D13 är för att sätta på och stänga av LED




void setup() {
  // put your setup code here, to run once:
  pinMode(Buzzer_Pin, OUTPUT);
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // put your main code here, to run repeatedly:

  //Funktion
  float batteryHeath = BatteryHealth(A0, Vref);
  //kan tas  bort, används för att testa och läsa av från Serial Monitor
  int rawADC = analogRead(A0);
  float voltage= (rawADC * Vref) / 1023.0; 
  Serial.print("ADC: ");
  Serial.print(rawADC);
  Serial.print(" | Delningsspänning: ");
  Serial.print(voltage, 2);  //för antal värdesiffror
  Serial.print(" V | Batterispänning: ");
  Serial.print(batteryHeath, 2);
  Serial.println(" V");
  delay(1000);

  warningSignal(true);

  warningSignal(false);

  
 
  
}

void warningSignal (bool level) {
  //True = last signal
  //false = First signal 
  if(level) {
    lastSignal();
  } else {
    firstSignal (); 
  }
}

//Piper en kort stund 4 gånger
void firstSignal () {
  for(int i= 0; i<4;i++) {
      analogWrite(Buzzer_Pin, 200);
      delay(500);
      analogWrite(Buzzer_Pin, 0);
      delay(500);
    }
}
//Lång Ljud signal, nu därefter ska systemet stängas av
void lastSignal () {
  analogWrite(Buzzer_Pin, 255);
  delay(6000);
  analogWrite(Buzzer_Pin, 0);
  //Här ska man kalla på Shutdown funktionen
}
