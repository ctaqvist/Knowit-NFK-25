import RPi.GPIO as GPIO
from time import sleep
import math

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

ARM_PINS = [17, 13]
CLAW_PIN = 27
L1 = 8.0
L2 = 8.0

# Initierar servos och sätter PWM till 0
def setup_pins():
    for p in ARM_PINS + [CLAW_PIN]:
        GPIO.setup(p, GPIO.OUT)

    pins = ARM_PINS + [CLAW_PIN]
    servos = [GPIO.PWM(p, 50) for p in pins]
    for s in servos:
        s.start(0)
    return servos

servo1, servo2, servo3 = setup_pins()

def angle_to_duty_cycle(angle):
    if not isinstance(angle, (int, float)):
        raise TypeError(f"Angle must be a number, got {type(angle).__name__}")
    if angle < -90 or angle > 90:
        raise ValueError(f"Angle {angle} out of range [-90, 90]")
    return 2 + (angle + 90) * 10 / 180

def set_servo_angle(servo, angle, hold=0.05):
    duty = angle_to_duty_cycle(angle)
    servo.ChangeDutyCycle(duty)
    sleep(hold)
    servo.ChangeDutyCycle(0)

def ik_planar(x, y):
    d2 = x*x + y*y
    c2 = (d2 - L1*L1 - L2*L2) / (2 * L1 * L2)
    c2 = max(-1.0, min(1.0, c2))  # clamp
    theta2 = math.acos(c2)
    k1 = L1 + L2 * math.cos(theta2)
    k2 = L2 * math.sin(theta2)
    theta1 = math.atan2(y, x) - math.atan2(k2, k1)
    return math.degrees(theta1), math.degrees(theta2)

def move_arm(x, y):
    reach = L1 + L2
    X = x * reach
    Y = y * reach
    theta1, theta2 = ik_planar(X, Y)
    # Clamp shoulder to [-90, 90]
    servo_shoulder_angle = max(-90, min(theta1, 90))
    # Map elbow [0,180] -> [-90,90] and clamp
    servo_elbow_angle = max(-90, min(theta2 - 90, 90))
    print(f"[DEBUG] move_arm, x={x:.2f}, y={y:.2f}, "
          f"theta1={theta1:.1f}, theta2={theta2:.1f} => "
          f"servo1={servo_shoulder_angle:.1f}, servo2={servo_elbow_angle:.1f}")
    set_servo_angle(servo1, servo_shoulder_angle)
    set_servo_angle(servo2, servo_elbow_angle)

def move_claw(v):
    angle = v * 90
    angle = max(0, min(angle, 90))  # clamp
    print(f"[DEBUG] move_claw, v={v:.2f}, angle={angle:.1f}")
    set_servo_angle(servo3, angle)