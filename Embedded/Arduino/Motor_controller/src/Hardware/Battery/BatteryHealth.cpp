#include "BatteryHealth.h"
#include <Arduino.h>


/*Variabler för firstSignal funktionen*/
unsigned long startTime_FirstSignal = 0;
bool isFirstSignalActive = false;
int signal_S = 0; // 0 = off & 1 = on
int signal_C = 0; // antal gånger det ska pipa.


/*Variabler för Last Signal funktionen*/

// 30 Sek, ska ge en varning varje 30 Sek
const unsigned long warningReminder = 30000; 
// För att mäta tiden, för hur många sek sen first signal
unsigned long lastWarning_Time = 0;          

/*Variabler för LastSignal Start funktionen*/

// ska vara false från början
bool islastSignalActive = false; 
unsigned long lastSignalWarn_time = 0;

// Läser av det analoga värdet från A0 och räknar ut laddningen av batteriet
float CalculateBatteryHealth(int analogPin, float Vref)
{
  // Läser av det analoga Pinnen
  int rawADC = analogRead(analogPin);       
  // 0-1023 (10 bitars)
  float voltage = (rawADC * Vref) / 1023.0; 
  float batteryVoltage = voltage * ((R1 + R2) / R2);

  // Ger batteri nivån
  return batteryVoltage;
}

int CheckBatteryLevel(float current_level)
{
  // Fösta gränsen, dags att ladda
  const float Warning = 7.0;
  // Nu ska allting stängas av
  const float Shutdown_Level = 6.4; 
  if (current_level <= Warning && current_level > Shutdown_Level)
  {
    return Battery_Warning;
  }
  else if (current_level <= Shutdown_Level)
  {
    return Battery_Shutdown;
  }
  else
  {
    return Battery_OK;
  }
}

void CheckBatteryAndWarn()
{
  // Current voltage of the battery
  float voltage = CalculateBatteryHealth(A0, Vref);

  // Battery Level
  int level = CheckBatteryLevel(voltage);

  if (level == Battery_Shutdown)
  {
    // last signal
    TriggerWarningSignal(true);

    // shutdown()
  }
  else if (level == Battery_Warning)
  {
    // First signal
    // Millis gör att den tiden inte pausar allt annat utan kör i bakgrunden
    unsigned long c_time = millis(); 
    unsigned long diff = c_time - lastWarning_Time;
    // Så att det triggas igång varje 30 Sekunder
    if (diff >= warningReminder)
    {
      TriggerWarningSignal(false);
      lastWarning_Time = c_time;
    }
  }

  // Just for testing
  Serial.print("Current Voltage: ");
  Serial.print(voltage, 2);
  Serial.println(" V");
}

// Bestämmer vilken varning signal som ska användas och sen sätter igång den
void TriggerWarningSignal(bool level)
{
  // True = last signal
  // false = First signal
  if (level)
  {
    StartLastSignal();
    TriggerLastSignal();
  }
  else
  {

    StartFirstSignal();
    TriggerFirstSignal();
  }
}

// Funktion för att flagga igång firstSignal funktionen och ha rätta värden där
void StartFirstSignal()
{
  isFirstSignalActive = true;
  signal_S = 0;
  signal_C = 0;
}

// Piper en kort stund 4 gånger
void TriggerFirstSignal()
{

  static unsigned long lastToggleTime = 0;
  unsigned long current_T = millis();

  if (!isFirstSignalActive)
    return;

  if (current_T - lastToggleTime >= 500)
  {
    lastToggleTime = current_T;

    if (signal_S == 0)
    {
      analogWrite(BUZZER_PIN, 200);
      signal_S = 1;
    }
    else
    {
      analogWrite(BUZZER_PIN, 0);
      signal_S = 0;
      signal_C++;
      // Efter 4 st pipa ljud
      if (signal_C >= 4)
      {
        isFirstSignalActive = false;
        signal_C = 0;
      }
    }
  }

  for (int i = 0; i < 4; i++)
  {
    analogWrite(BUZZER_PIN, 200);
    delay(500);
    analogWrite(BUZZER_PIN, 0);
    delay(500);
  }
}

// Funktionen för att sätta på timer och säga att last signal är aktiv
void StartLastSignal()
{
  islastSignalActive = true;
  // Börjar räkna sekunder.
  lastSignalWarn_time = millis(); 
}

// Lång Ljud signal systemet ska stängas av
void TriggerLastSignal()
{

  // Om inte signalen är aktiv ska inget hända
  if (!islastSignalActive)
    return;
  // Om det har gått 6 sekunder, då ska det inte pipa längre
  if (lastSignalWarn_time >= 6000)
  {
    analogWrite(BUZZER_PIN, 0);
    // klar med funktionen
    islastSignalActive = false; 
    // shutdown; SENARE NU BEHÖVS DET INTE
  }
  else
  {
    analogWrite(BUZZER_PIN, 255);
    Serial.println(lastSignalWarn_time);
  }
}
