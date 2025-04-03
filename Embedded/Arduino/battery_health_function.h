#ifndef BATTERY_H
#define BATTERY_H

//Funktion som läser av analoga värdet av batteriet för att ta reda på laddningen kvar
// Vref- Reference voltage av kortet
float BatteryHealth(int analogPin, float Vref);

#endif