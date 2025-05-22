try:
    import RPi.GPIO as GPIO
except ImportError:
    # Dummy GPIO for non-RPi environments
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
import threading, time

# GPIO setup
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

# Pin definitions
ARM_PINS = [17, 13]
CLAW_PIN = 27

# Motion parameters
DEAD_ZONE      = 0.05
ARM_MAX_SPEED   = 90.0
MAX_CLAW_ANGLE  = 180
CLAW_CLOSED_DC = 2.0
CLAW_OPEN_DC   = 12.0

# State variables
arm_angle    = 0.0
axis_angle   = 0.0
last_arm   = [0.0, 0.0]

# Input buffers for continuous control
input_shoulder = 0.0
input_axis     = 0.0
input_claw     = 0.0

# Servo objects (will be set in setup_pins)
servo1 = None
servo2 = None
servo3 = None

def setup_pins():
    global servo1, servo2, servo3

    # Initialize pins and PWM channels
    for p in ARM_PINS + [CLAW_PIN]:
        GPIO.setup(p, GPIO.OUT)
    servos = [GPIO.PWM(p, 50) for p in ARM_PINS + [CLAW_PIN]]
    for pwm in servos:
        pwm.start(0)
    servo1, servo2, servo3 = servos

    # Zero positions on startup
    set_servo_angle(servo1, 0.0, hold=0.2)
    set_servo_angle(servo2, 0.0, hold=0.2)
    set_servo_angle(servo3, 0.0, hold=0.2)

    # Start control loops
    start_movement_loops()
    return servos

def set_servo_angle(servo, angle, hold=0.02):

    # Map a desired angle (in degrees) to PWM duty cycle and pulse it.
    duty = 2 + (angle + 90) * 10.0 / 180.0
    servo.ChangeDutyCycle(duty)
    sleep(hold)
    servo.ChangeDutyCycle(0)

def move_arm(shoulder, axis, dt):
    global arm_angle, axis_angle

    # Continuous velocity-based control (inversion built-in if desired)
    if abs(shoulder) > DEAD_ZONE:

        # Clamp between -90 and 0
        arm_angle = max(-90.0, min(0.0, arm_angle - shoulder * ARM_MAX_SPEED * dt))
    if abs(axis) > DEAD_ZONE:

        # Clamp between 0 and 90
        axis_angle = max(0, min(90.0, axis_angle + axis * ARM_MAX_SPEED * dt))
    if abs(arm_angle  - last_arm[0]) > 0.5:
        set_servo_angle(servo1, arm_angle)
        last_arm[0] = arm_angle
    if abs(axis_angle - last_arm[1]) > 0.5:
        set_servo_angle(servo2, axis_angle)
        last_arm[1] = axis_angle

    # As long as claw_value > DEAD_ZONE: keep commanding full close (0°).
    # As long as claw_value < -DEAD_ZONE: keep commanding full open (MAX_CLAW_ANGLE).
def move_claw(claw_value):
    if claw_value > DEAD_ZONE:
        # Close the claw fully
        set_servo_angle(servo3, 0.0, hold=0.2)
    elif claw_value < -DEAD_ZONE:
        # Open the claw fully
        set_servo_angle(servo3, MAX_CLAW_ANGLE, hold=0.2)

def arm_loop():
    last_time = time.time()
    while True:
        now = time.time()
        dt = now - last_time
        last_time = now
        move_arm(input_shoulder, input_axis, dt)
        time.sleep(0.02)

def claw_loop():
    # Every 20 ms:
    # claw_value > DEAD_ZONE,  keep pulsing closed-duty (servo tries to close fully)
    # claw_value < -DEAD_ZONE, keep pulsing open-duty   (servo tries to open fully)
    # Otherwise, zero PWM (servo holds)
    while True:
        claw_value = _input_claw

        if claw_value > DEAD_ZONE:
            servo3.ChangeDutyCycle(CLAW_CLOSED_DC)
        elif claw_value < -DEAD_ZONE:
            servo3.ChangeDutyCycle(CLAW_OPEN_DC)
        else:
            servo3.ChangeDutyCycle(0)
        time.sleep(0.02)

def start_movement_loops():
    # Start both control threads for arm and claw.
    threading.Thread(target=arm_loop, daemon=True).start()
    threading.Thread(target=claw_loop, daemon=True).start()