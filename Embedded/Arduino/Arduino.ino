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

  /*
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

  warningSignal(false); */
  checkBatteryAndWarn ();
  delay(1000);
  
 
  
}
//Om 0 => allting är ok
//Om 1 => First signal
//Om 2 => Last signal 
int checkBatteryLevel(float current_level) {
  //Fösta gränsen, dags att ladda
  const float Warning = 7.5; //ska vara 7.0
  const float Shutdown_Level= 6.4;
  if(current_level <= Warning && current_level > Shutdown_Level) {
    return 1;
  } else if(current_level <= Shutdown_Level) {
    return 2;
  } else {
    return 0; 
  }
}

const unsigned long warningReminder = 30000; //30 Sek, ska ge en varning varje 30 Sek
unsigned long lastWarning_Time = 0; //För att mäta tiden, för hur många sek sen first signal
void checkBatteryAndWarn () {
  //Current voltage of the battery
  float voltage = BatteryHealth(A0, Vref);
  

  //Battery Level
  int level =  checkBatteryLevel(voltage);

  if(level == 2) {
    //last signal
    warningSignal(true);

    //shutdown()
  } else if(level == 1) {
    //First signal
    unsigned long c_time = millis(); //Millis gör att den tiden inte pausar allt annat utan kör i bakgrunden
    unsigned long diff = c_time - lastWarning_Time; 
    if (diff >= warningReminder) {
      warningSignal (false);
      lastWarning_Time = c_time; 
    }
    
  } 

  //Just for testing
  Serial.print("Current Voltage: ");
  Serial.print(voltage,2);
  Serial.println(" V");


}
void warningSignal (bool level) {
  //True = last signal
  //false = First signal 
  if(level) {
    lastSignal();
  } else {
    firstSignal(); 
  }
}

//Piper en kort stund 4 gånger
void firstSignal() {
  for(int i= 0; i<4;i++) {
      analogWrite(Buzzer_Pin, 200);
      delay(500);
      analogWrite(Buzzer_Pin, 0);
      delay(500);
    }
}
//Lång Ljud signal, nu därefter ska systemet stängas av
void lastSignal() {
  analogWrite(Buzzer_Pin, 255);
  delay(6000);
  analogWrite(Buzzer_Pin, 0);
  //Här ska man kalla på Shutdown funktionen
}
