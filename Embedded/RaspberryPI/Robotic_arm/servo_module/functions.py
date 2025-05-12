try:
    import RPi.GPIO as GPIO
except ImportError:
    # Kör utan riktigt GPIO – dummy-klass för att slippa fel
    class _DummyPWM:
        def start(self, duty): pass
        def ChangeDutyCycle(self, dc): pass

    class GPIO:
        BCM = None
        OUT = None
        @staticmethod
        def setwarnings(flag): pass
        @staticmethod
        def setmode(mode): pass
        @staticmethod
        def setup(pin, mode): pass
        @staticmethod
        def PWM(pin, freq):
            return _DummyPWM()

from time import sleep
import math

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

ARM_PINS = [17, 13]
CLAW_PIN = 27
servo1 = None
servo2 = None
servo3 = None

deadzone  = 0.05
last_arm  = [0.0, 0.0]
last_claw = 0.0

arm_angle  = 0.0
axis_angle = 0.0

def setup_pins():
    global servo1, servo2, servo3

    for p in ARM_PINS + [CLAW_PIN]:
        GPIO.setup(p, GPIO.OUT)

    pins   = ARM_PINS + [CLAW_PIN]
    servos = [GPIO.PWM(p, 50) for p in pins]
    for s in servos:
        s.start(0)

    # Assign to the globals
    servo1, servo2, servo3 = servos
    # Always drive to 0° on startup
    set_servo_angle(servo1, 0.0, hold=0.2)
    set_servo_angle(servo2, 0.0, hold=0.2)
    set_servo_angle(servo3, 0.0, hold=0.2)
    return servos

def set_servo_angle(servo, angle, hold=0.02):
    duty = 2 + (angle + 90) * 10/180
    servo.ChangeDutyCycle(duty)
    sleep(hold)
    servo.ChangeDutyCycle(0)

def move_arm(shoulder, axis, dt):
    global arm_angle, axis_angle

    max_speed = 90.0   # deg/sec
    # shoulder control
    if abs(shoulder) > deadzone:
        arm_angle = max(-90.0, min(90.0, arm_angle + shoulder * max_speed * dt))
    # axis control
    if abs(axis) > deadzone:
        axis_angle = max(-90.0, min(90.0, axis_angle + axis * max_speed * dt))

    # only fire the servo when there’s a meaningful change
    if abs(arm_angle  - last_arm[0]) > 0.5:
        set_servo_angle(servo1, arm_angle)
        last_arm[0] = arm_angle
    if abs(axis_angle - last_arm[1]) > 0.5:
        set_servo_angle(servo2, axis_angle)
        last_arm[1] = axis_angle


def move_claw(v):
    """
    v: joystick input in [-1.0…1.0]
    maps to theta in [0°…90°] when |v| > deadzone,
    otherwise holds the last position.
    """
    global last_claw

    # ensure numeric
    try:
        raw = float(v)
    except (TypeError, ValueError):
        return  # ignore invalid inputs

    # only update when outside deadzone
    if abs(raw) > deadzone:
        # map full forward to 90°, full backward to 0°
        theta = max(0.0, min(90.0, (raw + 1) * 45.0))
        # this maps raw=-1 → 0°, raw=0 → 45°, raw=+1 → 90°
        # adjust formula if you want 0→90 rather than centering at 45°
    else:
        theta = last_claw

    # if nothing changed, skip
    if theta == last_claw:
        return

    last_claw = theta
    # hold for 0.3 s so the claw actually moves
    set_servo_angle(servo3, theta, hold=0.3)