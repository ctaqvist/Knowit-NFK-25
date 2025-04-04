import serial
import time

arduino = serial.Serial('/dev/ttyACM0', 9600)
time.sleep(2)

arduino.write(b'TEST\\n')
print("Skickade: TEST")

# Vänta på svar
timeout = time.time() + 5  
while True:
    if arduino.in_waiting > 0:
        response = arduino.readline().decode().strip()
        print("Svar från Arduino:", response)
        break
    elif time.time() > timeout:
        print("Ingen respons från Arduino inom 5 sekunder.")
        break

arduino.close()
