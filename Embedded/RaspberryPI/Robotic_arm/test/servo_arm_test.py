import unittest
from unittest.mock import MagicMock, patch
from servo_module import functions as ac

class TestSetServoAngle(unittest.TestCase):
    @patch('servo_module.functions.sleep')
    def test_set_servo_angle_calls_change_and_sleep_and_zero(self, mock_sleep):
        servo = MagicMock()
        # angle = 30 → duty = 2 + (30+90)*10/180 = 8.666...
        ac.set_servo_angle(servo, 30.0, hold=0.1)
        # first call: duty cycle
        servo.ChangeDutyCycle.assert_any_call(2 + (30.0 + 90) * 10.0 / 180.0)
        mock_sleep.assert_called_once_with(0.1)
        # second call: zero out
        servo.ChangeDutyCycle.assert_any_call(0)

class TestMoveArm(unittest.TestCase):
    def setUp(self):
        # reset globals
        ac.arm_angle = 0.0
        ac.axis_angle = 0.0
        ac.last_arm = [0.0, 0.0]
        ac.servo1 = MagicMock()
        ac.servo2 = MagicMock()

    def test_move_arm_above_deadzone(self):
        with patch('servo_module.functions.set_servo_angle') as mock_set:
            ac.move_arm(shoulder=1.0, axis=1.0, dt=0.1)
            # arm_angle should move to -9.0, axis_angle to +9.0
            self.assertAlmostEqual(ac.arm_angle, -9.0)
            self.assertAlmostEqual(ac.axis_angle, 9.0)
            # set_servo_angle called for both servos
            mock_set.assert_any_call(ac.servo1, ac.arm_angle)
            mock_set.assert_any_call(ac.servo2, ac.axis_angle)
            # last_arm updated
            self.assertEqual(ac.last_arm, [ac.arm_angle, ac.axis_angle])

    def test_move_arm_within_deadzone(self):
        with patch('servo_module.functions.set_servo_angle') as mock_set:
            # inputs below deadzone → no motion
            ac.move_arm(shoulder=0.01, axis=0.01, dt=1.0)
            mock_set.assert_not_called()
            self.assertEqual(ac.arm_angle, 0.0)
            self.assertEqual(ac.axis_angle, 0.0)

class TestMoveClaw(unittest.TestCase):
    def setUp(self):
        ac.servo3 = MagicMock()

    def test_move_claw_close(self):
        with patch('servo_module.functions.set_servo_angle') as mock_set:
            ac.move_claw(raw=0.1)
            mock_set.assert_called_once_with(ac.servo3, 0.0, hold=0.2)

    def test_move_claw_open(self):
        with patch('servo_module.functions.set_servo_angle') as mock_set:
            ac.move_claw(raw=-0.1)
            mock_set.assert_called_once_with(ac.servo3, ac.MAX_CLAW_ANGLE, hold=0.2)

    def test_move_claw_deadzone(self):
        with patch('servo_module.functions.set_servo_angle') as mock_set:
            ac.move_claw(raw=0.0)
            mock_set.assert_not_called()

class TestStartMovementLoops(unittest.TestCase):
    @patch('servo_module.functions.threading.Thread')
    def test_start_movement_loops_creates_threads(self, mock_thread):
        fake_thread = MagicMock(start=MagicMock())
        mock_thread.return_value = fake_thread

        ac.start_movement_loops()

        # Should spawn exactly two threads
        self.assertEqual(mock_thread.call_count, 2)

        # Check that one thread targets arm_loop, one targets claw_loop
        targets = {call.kwargs['target'] for call in mock_thread.call_args_list}
        self.assertIn(ac.arm_loop, targets)
        self.assertIn(ac.claw_loop, targets)

        # And start() was called twice
        self.assertEqual(fake_thread.start.call_count, 2)

class TestSetupPins(unittest.TestCase):
    @patch('servo_module.functions.GPIO.setup')
    @patch('servo_module.functions.GPIO.PWM')
    @patch('servo_module.functions.set_servo_angle')
    @patch('servo_module.functions.start_movement_loops')
    def test_setup_pins(self, mock_start, mock_set_angle, mock_pwm, mock_setup):
        # Create three dummy PWM objects
        p1, p2, p3 = MagicMock(), MagicMock(), MagicMock()
        mock_pwm.side_effect = [p1, p2, p3]

        servos = ac.setup_pins()

        # setup() called once per pin
        pins = ac.ARM_PINS + [ac.CLAW_PIN]
        self.assertEqual(mock_setup.call_count, len(pins))
        for pin in pins:
            mock_setup.assert_any_call(pin, ac.GPIO.OUT)

        # PWM() called correctly
        for pin in pins:
            mock_pwm.assert_any_call(pin, 50)

        # Each PWM.start(0)
        p1.start.assert_called_once_with(0)
        p2.start.assert_called_once_with(0)
        p3.start.assert_called_once_with(0)

        # set_servo_angle called three times (zeroing each servo)
        self.assertEqual(mock_set_angle.call_count, 3)

        # Returns and sets global servo1,2,3
        self.assertEqual(servos, [p1, p2, p3])
        self.assertIs(ac.servo1, p1)
        self.assertIs(ac.servo2, p2)
        self.assertIs(ac.servo3, p3)

        # start_movement_loops called once
        mock_start.assert_called_once()

class TestArmLoop(unittest.TestCase):
    def test_arm_loop_single_iteration(self):
        # arrange inputs
        ac._input_shoulder = 0.2
        ac._input_axis = 0.3
        calls = []

        def fake_move(s, a, dt):
            calls.append((s, a, dt))

        with patch('servo_module.functions.move_arm', side_effect=fake_move):
            # fake time to return 1.0 then 1.1
            times = [1.0, 1.1]
            def fake_time():
                return times.pop(0)
            with patch('servo_module.functions.time.time', side_effect=fake_time):
                # break out of the loop on sleep
                with patch('servo_module.functions.time.sleep', side_effect=StopIteration):
                    with self.assertRaises(StopIteration):
                        ac.arm_loop()

        # should have called move_arm exactly once with dt=0.1
        self.assertEqual(len(calls), 1)
        s, a, dt = calls[0]
        self.assertAlmostEqual(s, 0.2)
        self.assertAlmostEqual(a, 0.3)
        self.assertAlmostEqual(dt, 0.1)

class TestClawLoop(unittest.TestCase):
    def setUp(self):
        ac.servo3 = MagicMock()

    def test_claw_loop_close_and_open_and_hold(self):
        # first: raw > deadzone
        ac._input_claw = 0.2
        with patch('servo_module.functions.time.sleep', side_effect=StopIteration):
            with self.assertRaises(StopIteration):
                ac.claw_loop()
        ac.servo3.ChangeDutyCycle.assert_called_with(ac.CLAW_CLOSED_DC)

        # second: raw < -deadzone
        ac._input_claw = -0.2
        ac.servo3.ChangeDutyCycle.reset_mock()
        with patch('servo_module.functions.time.sleep', side_effect=StopIteration):
            with self.assertRaises(StopIteration):
                ac.claw_loop()
        ac.servo3.ChangeDutyCycle.assert_called_with(ac.CLAW_OPEN_DC)

        # third: raw within deadzone → zero
        ac._input_claw = 0.0
        ac.servo3.ChangeDutyCycle.reset_mock()
        with patch('servo_module.functions.time.sleep', side_effect=StopIteration):
            with self.assertRaises(StopIteration):
                ac.claw_loop()
        ac.servo3.ChangeDutyCycle.assert_called_with(0)

if __name__ == '__main__':
    unittest.main()

# ~/Desktop/Joakim/NFK/Knowit-NFK-25/Embedded/RaspberryPI/Robotic_arm $ python -m unittest test/servo_arm_test.py