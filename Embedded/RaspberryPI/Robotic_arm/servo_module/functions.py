import RPi.GPIO as GPIO
from time import sleep
import math

# Suppress warnings and set mode
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

ARM_PINS = [17, 13]
CLAW_PIN = 27

for p in ARM_PINS + [CLAW_PIN]:
    GPIO.setup(p, GPIO.OUT)

servo1 = GPIO.PWM(ARM_PINS[0], 50)
servo2 = GPIO.PWM(ARM_PINS[1], 50)
servo3 = GPIO.PWM(CLAW_PIN, 50)

for s in (servo1, servo2, servo3):
    s.start(0)

def angle_to_duty_cycle(angle):
    if not isinstance(angle, (int, float)):
        raise TypeError(f"Angle must be a number, got {type(angle).__name__}")
    if angle < -90 or angle > 90:
        raise ValueError(f"Angle {angle} out of range [-90, 90]")
    return 2 + (angle + 90) * 10 / 180

def set_servo_angle(servo, angle, hold=0.02):
    duty = angle_to_duty_cycle(angle)
    servo.ChangeDutyCycle(duty)
    sleep(hold)
    servo.ChangeDutyCycle(0)

l1, l2 = 8.0, 8.0

def ik_planar(x, y):
    d2 = x*x + y*y
    c2 = (d2 - l1*l1 - l2*l2) / (2 * l1 * l2)
    c2 = max(-1.0, min(1.0, c2))  # clamp
    theta2 = math.acos(c2)
    k1 = l1 + l2 * math.cos(theta2)
    k2 = l2 * math.sin(theta2)
    theta1 = math.atan2(y, x) - math.atan2(k2, k1)
    return math.degrees(theta1), math.degrees(theta2)

def move_arm(x, y):
    θ1, θ2 = ik_planar(x, y)
    # Clamp shoulder to [-90, 90]
    servo_shoulder_angle = max(-90, min(θ1, 90))
    # Map elbow [0,180] -> [-90,90] and clamp
    servo_elbow_angle = max(-90, min(θ2 - 90, 90))
    print(f"[DEBUG] move_arm, x={x:.2f}, y={y:.2f}, "
          f"θ1={θ1:.1f}, θ2={θ2:.1f} => "
          f"servo1={servo_shoulder_angle:.1f}, servo2={servo_elbow_angle:.1f}")
    set_servo_angle(servo1, servo_shoulder_angle)
    set_servo_angle(servo2, servo_elbow_angle)

def move_claw(v):
    angle = v * 90
    angle = max(0, min(angle, 90))  # clamp
    print(f"[DEBUG] move_claw, v={v:.2f}, angle={angle:.1f}")
    set_servo_angle(servo3, angle)