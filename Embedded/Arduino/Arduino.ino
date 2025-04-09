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

  
  checkBatteryAndWarn ();
  delay(1000);
  
 
  
}
//Om 0 => allting är ok
//Om 1 => First signal
//Om 2 => Last signal 
int checkBatteryLevel(float current_level) {
  //Fösta gränsen, dags att ladda
  const float Warning = 7.0; 
  const float Shutdown_Level= 6.4; //Nu ska allting stängas av 
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
    lastSignalStart();
    lastSignal();
  } else {

    firstSignalStart();
    firstSignal(); 
  }
}

/*Variabler för firstSignal funktionen*/
unsigned long startTime_FirstSignal = 0;
bool isFirstSignalActive = false;
int signal_S = 0; // 0 = off & 1 = on 
int signal_C = 0; //antal gånger det ska pipa.

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

/*Variabler för LastSignal funktionen*/
bool islastSignalActive = false; //ska vara false från början
unsigned long lastSignalWarn_time = 0; 

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
 