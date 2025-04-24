from time import sleep
import RPi.GPIO as GPIO # type: ignore
def angle_to_duty(angle):

    # Mappa vinkeln till duty cycle
    return 7 + (angle / 90) * 5

# Funktion som flyttar servomotorerna från en vinkel till en annan, gradvis.
def move_servos(servos, start_angle, end_angle, step=1, delay=0.02):

    # Create a range of angles that increases or decreases.
    if start_angle < end_angle:
        angle_range = range(start_angle, end_angle + 1, step)
    else:
        angle_range = range(start_angle, end_angle - 1, -step)
    
    for angle in angle_range:
        duty = angle_to_duty(angle)
        for servo in servos:
            servo.ChangeDutyCycle(duty)
        sleep(delay)
    sleep(0.5)
    
    # --- Added for forwarder compatibility ---
def move_arm(x, y):
    print(f"[DEBUG] move_arm called with x={x}, y={y}")
    # Example usage: move_servos([servo1, servo2], current_angle, target_angle)
    pass

def move_claw(value):
    print(f"[DEBUG] move_claw called with value={value}")
    # Example usage: move_servos([claw_servo], current_angle, target_angle)
    pass