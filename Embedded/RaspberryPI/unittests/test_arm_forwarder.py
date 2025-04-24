import sys
from unittest.mock import MagicMock

# Mocking GPIO dependencies for testing on non-RPi platforms
sys.modules["RPi"] = MagicMock()
sys.modules["RPi.GPIO"] = MagicMock()

import pytest
import json
from unittest.mock import patch
from RaspberryPI.commands.arm.forwarder import forward_arm, forward_claw

# Simulated websocket class to capture sent messages
class FakeWebSocket:
    def __init__(self):
        self.sent_messages = []

    async def send(self, message):
        self.sent_messages.append(json.loads(message))

# Test: Valid arm data should call move_arm and send OK status
@patch("RaspberryPI.commands.arm.forwarder.move_arm")
@pytest.mark.asyncio
async def test_forward_arm_valid(mock_move_arm):
    ws = FakeWebSocket()
    arm_data = {"x": 0.5, "y": -0.3}
    await forward_arm(arm_data, ws)

    mock_move_arm.assert_called_once_with(0.5, -0.3)
    assert ws.sent_messages[-1]["status"] == "ok"
    assert "Arm moved" in ws.sent_messages[-1]["response"]

# Test: Invalid x value should not call move_arm and should send error
@patch("RaspberryPI.commands.arm.forwarder.move_arm")
@pytest.mark.asyncio
async def test_forward_arm_invalid_data(mock_move_arm):
    ws = FakeWebSocket()
    arm_data = {"x": "hej", "y": 0.2}
    await forward_arm(arm_data, ws)

    mock_move_arm.assert_not_called()
    assert ws.sent_messages[-1]["status"] == "error"

# Test: Valid claw data should call move_claw and send OK status
@patch("RaspberryPI.commands.arm.forwarder.move_claw")
@pytest.mark.asyncio
async def test_forward_claw_valid(mock_move_claw):
    ws = FakeWebSocket()
    claw_data = {"claw": 1.0}
    await forward_claw(claw_data, ws)

    mock_move_claw.assert_called_once_with(1.0)
    assert ws.sent_messages[-1]["status"] == "ok"
    assert "Claw moved" in ws.sent_messages[-1]["response"]

# Test: Invalid claw data should not call move_claw and should send error
@patch("RaspberryPI.commands.arm.forwarder.move_claw")
@pytest.mark.asyncio
async def test_forward_claw_invalid_data(mock_move_claw):
    ws = FakeWebSocket()
    claw_data = {"claw": "invalid"}
    await forward_claw(claw_data, ws)

    mock_move_claw.assert_not_called()
    assert ws.sent_messages[-1]["status"] == "error"

# Test: Missing 'y' key should return error
@pytest.mark.asyncio
async def test_forward_arm_missing_keys():
    from RaspberryPI.commands.arm.forwarder import forward_arm
    ws = FakeWebSocket()
    arm_data = {"x": 0.5}  # missing 'y'

    await forward_arm(arm_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid x/y" in ws.sent_messages[-1]["message"]

# Test: Empty claw data should return error
@pytest.mark.asyncio
async def test_forward_claw_missing_key():
    from RaspberryPI.commands.arm.forwarder import forward_claw
    ws = FakeWebSocket()
    claw_data = {}  # empty dict

    await forward_claw(claw_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid claw" in ws.sent_messages[-1]["message"]

# Test: Edge value 0.0 for claw is accepted
@pytest.mark.asyncio
async def test_forward_claw_edge_values():
    from RaspberryPI.commands.arm.forwarder import forward_claw
    ws = FakeWebSocket()
    claw_data = {"claw": 0.0}

    with patch("RaspberryPI.commands.arm.forwarder.move_claw") as mock_claw:
        await forward_claw(claw_data, ws)

        mock_claw.assert_called_once_with(0.0)
        assert ws.sent_messages[-1]["status"] == "ok"

# Test: Only 'y' provided should return error
@pytest.mark.asyncio
async def test_forward_arm_missing_x():
    from RaspberryPI.commands.arm.forwarder import forward_arm
    ws = FakeWebSocket()
    arm_data = {"y": 0.5}  # missing 'x'

    await forward_arm(arm_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid" in ws.sent_messages[-1]["message"]

# Test: Only 'x' provided should return error
@pytest.mark.asyncio
async def test_forward_arm_missing_y():
    from RaspberryPI.commands.arm.forwarder import forward_arm
    ws = FakeWebSocket()
    arm_data = {"x": 0.5}  # missing 'y'

    await forward_arm(arm_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid" in ws.sent_messages[-1]["message"]

# Test: 'None' as claw value should return error
@pytest.mark.asyncio
async def test_forward_claw_none():
    from RaspberryPI.commands.arm.forwarder import forward_claw
    ws = FakeWebSocket()
    claw_data = {"claw": None}

    await forward_claw(claw_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid" in ws.sent_messages[-1]["message"]