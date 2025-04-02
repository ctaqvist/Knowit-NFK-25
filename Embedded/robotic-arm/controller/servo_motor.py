from gpiozero import Servo
from time import sleep

servo = Servo( 12, min_pulse_width = 500/1_000_000, max_pulse_width = 2500/1_000_000 )

while True:
    print( "Moving to 0   (Min)" )
    servo.value = -1
    sleep(2)
    
    print( "Moving to 90  (Mid)" )
    servo.value = 0
    sleep(2)
    
    print( "Moving to 180  (Max)" )
    servo.value = 1
    sleep(2)