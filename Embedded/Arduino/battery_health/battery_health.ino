const float R1 = 20000.0;
const float R2 = 10000.0;

const float  battery_limit = 8.0; //Innna man får en varning
const int ledPin = 13; //D13 är för att sätta på och stänga av LED


const float Vref = 5.0;
void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // put your main code here, to run repeatedly:
  int rawADC = analogRead(A0);                        //Läser spänningen analogt vid delningspunkten
  float voltage = (rawADC * Vref) / 1023.0;           //0-1023 (10 bitars)
  float batteryVoltage = voltage * ((R1 + R2) / R2);  //Beräkningen

  Serial.print("ADC: ");
  Serial.print(rawADC);
  Serial.print(" | Delningsspänning: ");
  Serial.print(voltage, 2);  //för antal värdesiffror
  Serial.print(" V | Batterispänning: ");
  Serial.print(batteryVoltage, 2);
  Serial.println(" V");

  if(batteryVoltage < battery_limit) {
    digitalWrite(ledPin, HIGH); //Tänder RÖD LED
  } else {
    digitalWrite(ledPin, LOW); //Släcker RÖD LED
  }

  delay(1000);
}
