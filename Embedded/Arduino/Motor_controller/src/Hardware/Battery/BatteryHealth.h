#ifndef BATTERY_H
#define BATTERY_H
#include <Arduino.h>
/* Batteri status nivåer
*  0 => Allting är ok
*  1 => First Signal
*  2 => Last Signal*/
enum BatteryStatus
{
  Battery_OK = 0,
  Battery_Warning = 1,
  Battery_Shutdown = 2
};

// Hardware relaterade konstanter

// Pin nummer för Buzzer
constexpr int BUZZER_PIN = 13;

// Resistor 1
constexpr float R1 = 20000.0;

// Resistor 2
constexpr float R2 = 10000.0;

// Arduinos Spänningsreferens
constexpr float VREF = 5.0; 

// 30 Sek, ska ge en varning varje 30 Sek. Används i lastSignal funktionen
constexpr unsigned long WARNING_REMINDER = 30000;


// Varnings nivåer för batteriet
// Första gränsen, dags att ladda
constexpr float BATTERY_WARNING_LEVEL = 7.0; 
// Nu ska allting stängas av
constexpr float BATTERY_SHUTDOWN_LEVEL = 6.4;
/*
* Funktion som läser av analoga värdet av batteriet för att ta reda på laddningen kvar
* Vref- Reference voltage av kortet
*/
float CalculateBatteryHealth(int analogPin, float Vref);

// Checkar batteri nivån och returnerar en int som baserat på nivån
int CheckBatteryLevel(float current_level);

// Checkar batteri nivån och triggar en varning om nivån är för låg
void CheckBatteryAndWarn();

// Bestämmer vilken varning signal som ska användas och sen sätter igång den
void TriggerWarningSignal(bool level);

// Funktion för att flagga igång firstSignal funktionen och ha rätta värden där
void StartFirstSignal();

// Piper en kort stund 4 gånger
void TriggerFirstSignal();

// Funktion för att flagga igång lastSignal funktionen och ha rätta värden där
void StartLastSignal();

// Piper en kort stund 1 gång
void TriggerLastSignal();

#endif