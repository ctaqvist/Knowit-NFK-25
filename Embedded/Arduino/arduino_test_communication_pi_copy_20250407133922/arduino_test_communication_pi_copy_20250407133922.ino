void setup() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("READY");
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input == "fwd") {
      Serial.println("{\"ack\":\"fwd\"}");
    } else if (input == "stop") {
      Serial.println("{\"ack\":\"stop\"}");
    } else if (input == "ping") {
      Serial.println("{\"ack\":\"pong\"}");
    } else if (input == "status") {
      Serial.println("{\"status\":\"running\"}");
    } else {
      Serial.println("{\"error\":\"unknown command\"}");
    }
  }
}



