#include <ArduinoJson.h>

void setup() {
  Serial.begin(115200);  // Initialisering av seriell kommunikation
  while (!Serial);       // Vänta på att serial-porten ska vara redo
  Serial.println("{\"status\":\"READY\"}");  // Skicka ett startmeddelande till Raspberry Pi
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');  // Läs in hela kommandot tills ny rad
    input.trim();  // Ta bort onödiga mellanslag eller nya rader

    // Skapa en JsonDocument för att tolka den inkommande JSON-strängen
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, input);

    if (error) {
      Serial.println("{\"error\":\"invalid_json\"}");  // Om JSON inte går att läsa
      return;
    }

    // Läs kommandot från JSON
    const char* command = doc["command"];

    if (strcmp(command, "fwd") == 0) {
      // Om kommandot är 'fwd', kör framåt
      Serial.println("{\"ack\":\"fwd\"}");
    }
    else if (strcmp(command, "stop") == 0) {
      // Om kommandot är 'stop', stoppa motorn
      Serial.println("{\"ack\":\"stop\"}");
    }
    else if (strcmp(command, "ping") == 0) {
      // Om kommandot är 'ping', svara med 'pong'
      Serial.println("{\"ack\":\"pong\"}");
    }
    else if (strcmp(command, "status") == 0) {
      // Om kommandot är 'status', skicka en status tillbaka
      Serial.println("{\"status\":\"running\"}");
    }
    else if (strcmp(command, "navigate") == 0) {
      // Om kommandot är 'navigate', hantera navigationsparametrarna
      float angle = doc["angle"];
      int speed = doc["speed"];
      bool forward = doc["forward"];

      // Skicka ett svar tillbaka till Raspberry Pi
      StaticJsonDocument<128> response;
      response["ack"] = "navigate";
      response["angle"] = angle;
      response["speed"] = speed;
      response["forward"] = forward;

      // Skriv ut JSON-responsen
      serializeJson(response, Serial);
      Serial.println();  // Avsluta med ny rad för att säkerställa korrekt överföring
    }
    else if (strcmp(command, "set_speed") == 0) {
      // Om kommandot är 'set_speed', sätt hastigheten
      float speed = doc["value"];

      // Validera att hastigheten är inom det tillåtna intervallet
      if (speed >= 0.0 && speed <= 1.0) {
        StaticJsonDocument<128> response;
        response["ack"] = "set_speed";
        response["value"] = speed;
        serializeJson(response, Serial);
        Serial.println();
      } else {
        Serial.println("{\"error\":\"invalid_speed_range\"}");
      }
    }
    else {
      // Om inget av de kända kommandona matchade, skicka ett felmeddelande
      Serial.println("{\"error\":\"unknown_command\"}");
    }

    // Kort fördröjning för att säkerställa att Arduino kan bearbeta nästa kommando ordentligt
    delay(10);
  }
}

