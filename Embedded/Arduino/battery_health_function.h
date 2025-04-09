#ifndef BATTERY_H
#define BATTERY_H

//Funktion som läser av analoga värdet av batteriet för att ta reda på laddningen kvar
// Vref- Reference voltage av kortet
float BatteryHealth(int analogPin, float Vref);
int checkBatteryLevel(float current_level) ;
void checkBatteryAndWarn ();
void warningSignal (bool level);
void firstSignalStart ();
void firstSignal();
void lastSignalStart();
void lastSignal();

#endif