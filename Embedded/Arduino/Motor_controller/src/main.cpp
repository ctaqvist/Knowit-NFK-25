#include "Arduino.h"
#include "Backend/CommandHandler.h"
#include "Hardware/Battery/BatteryHealth.h"
#include "Hardware/Motor/MotorController.h"
#include "Calculations/Drive.h"
#include "Hardware/SpotLights/SpotLight.h"
#include "Hardware/HardWareConfig.h"

void setup()
{
  Serial.begin(115200);
  pinMode(SPOTLIGHTS_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BATTERY_PIN, INPUT);
  // Initiera CommandHandler så Arduino är redo att ta emot JSON-kommandon
  commandHandler.init();
}

void loop()
{
  commandHandler.listen();
  CheckBatteryAndWarn();
  SendBatteryStatusToServer();
}
