import RPi.GPIO as GPIO
from servo_module.functions import move_servos
from time import sleep

GPIO.setmode(GPIO.BCM)

neutral = 0
left = -90
right = 90

# Bestämmer GPIO Pins för servomotorerna
servo_pins = [13, 12, 17, 27]
for pin in servo_pins:
    GPIO.setup(pin, GPIO.OUT)

# Första motorn
servo1 = GPIO.PWM(servo_pins[0], 50)

# Andra motorn
servo2 = GPIO.PWM(servo_pins[1], 50)

# Tredje motorn
servo3 = GPIO.PWM(servo_pins[2], 50)

# Claw arm
servo4 = GPIO.PWM(servo_pins[3], 50)

# Startar PWM med 0% duty cycle
servo1.start(0)
servo2.start(0)
servo3.start(0)
servo4.start(0)

arm_servos = [servo1, servo2, servo3]
claw_servo = [servo4]

try:
    # Start at 0° (neutral) for all servos.
    print(f"Starting at {neutral}°")
    move_servos(claw_servo, 0, 0)
    sleep(1)
    
    # Rotate from 0° to 90°.
    print(f"Moving from {neutral}° to {right}°")
    move_servos(claw_servo, 0, 90)
    sleep(1)

    move_servos([servo1], 0, left)
    sleep(1)

    move_servos([servo1], 0, 0)
    sleep(1)
    
    # Move from 90° back to 0°.
    ##print(f"Moving from {right}° back to {neutral}°")
    # move_servos(arm_servos, 90, 0)
    # sleep(1)
    
    # Rotate from 0° to -90°.
    # print(f"Moving from {neutral}° to {left}°")
    # move_servos(arm_servos, 0, -90)
    # sleep(1)
    
    # Return from -90° back to 0°.
    # print(f"Moving from {left}° back to {neutral}°")
    #move_servos(arm_servos, -90, 0)
    # sleep(1)

finally:
    # Resettar duty cycle till 0% och kör en clean-up.
    claw_servo[0].ChangeDutyCycle(0)
    for servo in arm_servos:
        servo.ChangeDutyCycle(0)
        servo.stop()
    GPIO.cleanup() 