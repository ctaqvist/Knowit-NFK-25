#include "battery_health.h"
#include <Arduino.h>

/*
  * Function for battery health. 
  * analogPin - Number of the pin to read the battery voltage level
  * Vref of the Micro controller
*/
const int Buzzer_Pin = 13; 
const float R1 = 20000.0;
const float R2 = 10000.0;


/*Variabler för firstSignal funktionen*/
unsigned long startTime_FirstSignal = 0;
bool isFirstSignalActive = false;
int signal_S = 0; // 0 = off & 1 = on 
int signal_C = 0; //antal gånger det ska pipa.

//Arduinos Spänningsreferens
const float Vref = 5.0;

/*Variabler för Last Signal funktionen*/
const unsigned long warningReminder = 30000; //30 Sek, ska ge en varning varje 30 Sek
unsigned long lastWarning_Time = 0; //För att mäta tiden, för hur många sek sen first signal

/*Variabler för LastSignal Start funktionen*/
bool islastSignalActive = false; //ska vara false från början
unsigned long lastSignalWarn_time = 0;

//Läser av det analoga värdet från A0 och räknar ut laddningen av batteriet
float BatteryHealth(int analogPin, float Vref) {
  int rawADC = analogRead(analogPin); //Läser av det analoga Pinnen
  float voltage= (rawADC * Vref) / 1023.0; //0-1023 (10 bitars)
  float batteryVoltage= voltage * ((R1 + R2)/R2);

  //Ger batteri nivån
  return batteryVoltage;

}

//Om 0 => allting är ok
//Om 1 => First signal
//Om 2 => Last signal 
enum BatteryStatus {
  Battery_OK = 0,
  Battery_Warning = 1,
  Battery_Shutdown= 2
};
int checkBatteryLevel(float current_level) {
  //Fösta gränsen, dags att ladda
  const float Warning = 7.0; 
  const float Shutdown_Level= 6.4; //Nu ska allting stängas av 
  if(current_level <= Warning && current_level > Shutdown_Level) {
    return Battery_Warning;
  } else if(current_level <= Shutdown_Level) {
    return Battery_Shutdown;
  } else {
    return Battery_OK; 
  }
}





void checkBatteryAndWarn () {
  //Current voltage of the battery
  float voltage = BatteryHealth(A0, Vref);
  

  //Battery Level
  int level =  checkBatteryLevel(voltage);

  if(level == Battery_Shutdown) {
    //last signal
    warningSignal(true);

    //shutdown()
  } else if(level == Battery_Warning) {
    //First signal
    unsigned long c_time = millis(); //Millis gör att den tiden inte pausar allt annat utan kör i bakgrunden
    unsigned long diff = c_time - lastWarning_Time; 
    //Så att det triggas igång varje 30 Sekunder
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

//Bestämmer vilken varning signal som ska användas och sen sätter igång den
void warningSignal (bool level) {
  //True = last signal
  //false = First signal 
  if(level) {
    lastSignalStart();
    lastSignal();
  } else {

    firstSignalStart();
    firstSignal(); 
  }
}



//Funktion för att flagga igång firstSignal funktionen och ha rätta värden där 
void firstSignalStart () {
  isFirstSignalActive= true;
  signal_S = 0; 
  signal_C = 0;
}

//Piper en kort stund 4 gånger
void firstSignal() {

  static unsigned long lastToggleTime = 0; 
  unsigned long current_T = millis();

  if(!isFirstSignalActive) return; 

  if(current_T - lastToggleTime >= 500) {
    lastToggleTime = current_T;

    if(signal_S == 0) {
      analogWrite(Buzzer_Pin, 200);
      signal_S= 1;
    } else {
      analogWrite(Buzzer_Pin, 0);
      signal_S = 0;
      signal_C ++;
      //Efter 4 st pipa ljud
      if(signal_C >= 4) {
        isFirstSignalActive= false;
        signal_C= 0;  
      }
    }
  }

  for(int i= 0; i<4;i++) {
      analogWrite(Buzzer_Pin, 200);
      delay(500);
      analogWrite(Buzzer_Pin, 0);
      delay(500); 
    }
}

 

//Funktionen för att sätta på timer och säga att last signal är aktiv
void lastSignalStart(){
  islastSignalActive = true; 
  lastSignalWarn_time= millis(); //Börjar räkna sekunder.

}

//Lång Ljud signal systemet ska stängas av
void lastSignal() {

  //om inte signalen är aktiv ska inget hända
  if(!islastSignalActive) return; 
  //Om det har gått 6 sekunder, då ska det inte pipa längre
  if(lastSignalWarn_time >= 6000) {
    analogWrite(Buzzer_Pin, 0);
    islastSignalActive= false; //klar med funktionen 
    //shutdown; SENARE NU BEHÖVS DET INTE
  } else {
    analogWrite(Buzzer_Pin, 255);
    Serial.println(lastSignalWarn_time);
  }

}
