from gpiozero import Servo
from time import sleep

def angle_to_value(angle):
    return (angle)/90


servo1 = Servo(17, min_pulse_width=450/1_000_000, max_pulse_width=2500/1_000_000)
servo2 = Servo(12, min_pulse_width=450/1_000_000, max_pulse_width=2500/1_000_000)
servo3 = Servo(13, min_pulse_width=450/1_000_000, max_pulse_width=2500/1_000_000)

neutral = 0
right = 60
left = -20

try:
    # Start at neutral (0°).
    print("Starting at 0° (Neutral)")
    servo1.value = angle_to_value(neutral)
    servo2.value = angle_to_value(neutral)
    servo3.value = angle_to_value(neutral)
    sleep(3)
    
    # Move to -90° (left).
    print("Moving to -90° (Left)")
    servo1.value = angle_to_value(left)
    servo2.value = angle_to_value(left)
    servo3.value = angle_to_value(left)
    sleep(3)
    
    # Return to neutral (0°).
    print("Moving back to 0° (Neutral)")
    servo1.value = angle_to_value(neutral)
    servo2.value = angle_to_value(neutral)
    servo3.value = angle_to_value(neutral)
    sleep(3)
    
    # Move to +90° (right).
    print("Moving to +90° (Right)")
    servo1.value = angle_to_value(right)
    servo2.value = angle_to_value(right)
    servo3.value = angle_to_value(right)
    sleep(3)

finally:
    # Before exiting, ensure that the servos return to neutral.
    print("Returning to 0° (Neutral) before exiting")
    servo1.value = angle_to_value(neutral)
    servo2.value = angle_to_value(neutral)
    servo3.value = angle_to_value(neutral)
    sleep(3)
