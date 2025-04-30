#include "BatteryHealth.h"
#include <Arduino.h>

/*Variabler för firstSignal funktionen*/
unsigned long firstSignalStartTime = 0;
bool firstSignalActive = false;
// 0 = off & 1 = on
int buzzerState = 0;
// antal gånger det ska pipa.      
int buzzerPulseCount = 0; 

/*Variabler för Last Signal funktionen*/
// För att mäta tiden, för hur många sek sen first signal
unsigned long lastWarningTriggerTime = 0;

/*Variabler för LastSignal Start funktionen*/

// ska vara false från början
bool lastSignalActive = false;
unsigned long lastSignalStartTime = 0;

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
  if (current_level <= BATTERY_WARNING_LEVEL && current_level > BATTERY_SHUTDOWN_LEVEL)
  {
    return Battery_Warning;
  }
  else if (current_level <= BATTERY_SHUTDOWN_LEVEL)
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
  float voltage = CalculateBatteryHealth(A0, VREF);

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
    unsigned long currentTime = millis();
    unsigned long timeSinceLastWarning = currentTime - lastWarningTriggerTime;
    // Så att det triggas igång varje 30 Sekunder
    if (timeSinceLastWarning >= WARNING_REMINDER)
    {
      TriggerWarningSignal(false);
      lastWarningTriggerTime = currentTime;
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
  firstSignalActive = true;
  buzzerState = 0;
  buzzerPulseCount = 0;
}

// Piper en kort stund 4 gånger
void TriggerFirstSignal()
{
  static unsigned long lastToggleTime = 0;
  unsigned long currentTime = millis();
  if (!firstSignalActive)
    return;

  if (currentTime - lastToggleTime >= 500)
  {
    lastToggleTime = currentTime;

    if (buzzerState == 0)
    {
      analogWrite(BUZZER_PIN, 200);
      buzzerState = 1;
    }
    else
    {
      analogWrite(BUZZER_PIN, 0);
      buzzerState = 0;
      buzzerPulseCount++;
      // Efter 4 st pipa ljud
      if (buzzerPulseCount >= 4)
      {
        firstSignalActive = false;
        buzzerPulseCount = 0;
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
  lastSignalActive = true;
  // Börjar räkna sekunder.
  lastSignalStartTime = millis();
}

// Lång Ljud signal systemet ska stängas av
void TriggerLastSignal()
{
  // Om inte signalen är aktiv ska inget hända
  if (!lastSignalActive)
  {
    return;
  }
  // Om det har gått 6 sekunder, då ska det inte pipa längre
  if (lastSignalStartTime >= 6000)
  {
    analogWrite(BUZZER_PIN, 0);
    // klar med funktionen
    lastSignalActive = false;
    // shutdown; SENARE NU BEHÖVS DET INTE
  }
  else
  {
    analogWrite(BUZZER_PIN, 255);
    Serial.println(lastSignalStartTime);
  }
}
