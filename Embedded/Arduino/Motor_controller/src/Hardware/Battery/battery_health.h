#ifndef BATTERY_H
#define BATTERY_H

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