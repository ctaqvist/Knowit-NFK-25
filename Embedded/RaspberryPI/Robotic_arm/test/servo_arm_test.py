import unittest
from unittest.mock import MagicMock, patch
import io
import sys
import math

import servo_module.functions as funcs

class TestSetServoAngleAdditional(unittest.TestCase):
    @patch('servo_module.functions.sleep', return_value=None)
    def test_set_servo_angle_valid_and_duty_sequence(self, mock_sleep):
        # Create a mock servo
        servo = MagicMock()
        # Test for a sample angle
        funcs.set_servo_angle(servo, 30, hold=0)
        # Compute expected duty
        expected_duty = funcs.angle_to_duty_cycle(30)
        # Verify ChangeDutyCycle called with expected duty then 0
        servo.ChangeDutyCycle.assert_any_call(expected_duty)
        servo.ChangeDutyCycle.assert_any_call(0)
        # Ensure sleep called with hold
        mock_sleep.assert_called_with(0)

    def test_set_servo_angle_invalid_type_and_range(self):
        servo = MagicMock()
        with self.assertRaises(TypeError):
            funcs.set_servo_angle(servo, 'not_a_number')
        with self.assertRaises(ValueError):
            funcs.set_servo_angle(servo, 1000)

class TestIkPlanarEdgeCases(unittest.TestCase):
    def test_ik_planar_zero_point(self):
        # Zero point leads to division by zero avoidance
        theta1, theta2 = funcs.ik_planar(0, 0)
        # Should return finite angles
        self.assertTrue(math.isfinite(theta1))
        self.assertTrue(math.isfinite(theta2))

    def test_ik_planar_negative_coordinates(self):
        # Negative x,y values
        theta1, theta2 = funcs.ik_planar(-8, 8)
        # Angles should be within valid domain
        self.assertTrue(-180 <= theta1 <= 180)
        self.assertTrue(0 <= theta2 <= 180)

class TestMoveArmAndClaw(unittest.TestCase):
    def setUp(self):
        # Patch sleep to avoid delay
        patcher = patch('servo_module.functions.sleep', return_value=None)
        self.mock_sleep = patcher.start()
        self.addCleanup(patcher.stop)
        # Backup real servos
        self.real_shoulder = funcs.servo1
        self.real_elbow = funcs.servo2
        self.real_claw = funcs.servo3
        # Replace servos with mocks
        funcs.servo1 = MagicMock()
        funcs.servo2 = MagicMock()
        funcs.servo3 = MagicMock()

    def tearDown(self):
        # Restore real servos
        funcs.servo1 = self.real_shoulder
        funcs.servo2 = self.real_elbow
        funcs.servo3 = self.real_claw

    def test_move_arm_within_range(self):
        # Move to a reachable point
        with patch('sys.stdout', new=io.StringIO()) as fake_out:
            funcs.move_arm(8, 8)
            output = fake_out.getvalue()
        # Check that debug print contains expected labels
        self.assertIn('move_arm, x=8.00, y=8.00', output)
        # Ensure servos received ChangeDutyCycle calls
        self.assertTrue(funcs.servo1.ChangeDutyCycle.called)
        self.assertTrue(funcs.servo2.ChangeDutyCycle.called)

    def test_move_arm_out_of_range_clamped(self):
        # Use a point beyond reach to test clamping
        with patch('sys.stdout', new=io.StringIO()) as fake_out:
            funcs.move_arm(100, 0)
            out = fake_out.getvalue()
        # Shoulder angle should be clamped within [-90,90] and printed correctly
        self.assertIn('servo1=0.0', out)
        # Elbow angle should be clamped to -90
        self.assertIn('servo2=-90.0', out)

    def test_move_claw_within_and_out_of_range(self):
        # Within range
        with patch('sys.stdout', new=io.StringIO()) as fake_out:
            funcs.move_claw(0.5)
            out1 = fake_out.getvalue()
        self.assertIn('move_claw, v=0.50, angle=45.0', out1)
        funcs.servo3.ChangeDutyCycle.assert_any_call(funcs.angle_to_duty_cycle(45))

        # Below range
        with patch('sys.stdout', new=io.StringIO()) as fake_out2:
            funcs.move_claw(-1)
            out2 = fake_out2.getvalue()
        self.assertIn('move_claw, v=-1.00, angle=0.0', out2)

        # Above range
        with patch('sys.stdout', new=io.StringIO()) as fake_out3:
            funcs.move_claw(2)
            out3 = fake_out3.getvalue()
        self.assertIn('move_claw, v=2.00, angle=90.0', out3)

if __name__ == '__main__':
    unittest.main()

"""
To run the tests:
cd Desktop/Joakim/NFK/Knowit-NFK-25/Embedded/RaspberryPI/Robotic_arm
python3 -m coverage run \
  --source=servo_module \
  -m pytest test/servo_arm_test.py
If you wish to generate coverage report:
python3 -m coverage report -m --omit="*/test_*"
"""