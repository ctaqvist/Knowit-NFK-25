import sys
import json
import pytest
from unittest.mock import MagicMock, patch

# Mock GPIO modules for non-RPi testing environments
sys.modules["RPi"] = MagicMock()
sys.modules["RPi.GPIO"] = MagicMock()

from RaspberryPI.commands.arm.forwarder import forward_arm, forward_claw

class FakeWebSocket:
    """Simulated websocket for capturing sent messages."""
    def __init__(self):
        self.sent_messages = []

    async def send(self, message):
        self.sent_messages.append(json.loads(message))

@patch("RaspberryPI.commands.arm.forwarder.move_arm")
@pytest.mark.asyncio
async def test_forward_arm_valid(mock_move_arm):
    """Test valid arm input calls move_arm and returns success."""
    ws = FakeWebSocket()
    arm_data = {"x": 0.5, "y": -0.3}
    await forward_arm(arm_data, ws)

    mock_move_arm.assert_called_once_with(0.5, -0.3)
    assert ws.sent_messages[-1]["status"] == "ok"
    assert "Arm moved" in ws.sent_messages[-1]["response"]

@patch("RaspberryPI.commands.arm.forwarder.move_arm")
@pytest.mark.asyncio
async def test_forward_arm_invalid_data(mock_move_arm):
    """Test invalid x value results in error response."""
    ws = FakeWebSocket()
    arm_data = {"x": "hej", "y": 0.2}
    await forward_arm(arm_data, ws)

    mock_move_arm.assert_not_called()
    assert ws.sent_messages[-1]["status"] == "error"

@patch("RaspberryPI.commands.arm.forwarder.move_claw")
@pytest.mark.asyncio
async def test_forward_claw_valid(mock_move_claw):
    """Test valid claw input calls move_claw and returns success."""
    ws = FakeWebSocket()
    claw_data = {"claw": 1.0}
    await forward_claw(claw_data, ws)

    mock_move_claw.assert_called_once_with(1.0)
    assert ws.sent_messages[-1]["status"] == "ok"
    assert "Claw moved" in ws.sent_messages[-1]["response"]

@patch("RaspberryPI.commands.arm.forwarder.move_claw")
@pytest.mark.asyncio
async def test_forward_claw_invalid_data(mock_move_claw):
    """Test invalid claw input results in error response."""
    ws = FakeWebSocket()
    claw_data = {"claw": "invalid"}
    await forward_claw(claw_data, ws)

    mock_move_claw.assert_not_called()
    assert ws.sent_messages[-1]["status"] == "error"

@pytest.mark.asyncio
async def test_forward_arm_missing_keys():
    """Test missing 'y' key in arm data results in error."""
    ws = FakeWebSocket()
    arm_data = {"x": 0.5}
    await forward_arm(arm_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid x/y" in ws.sent_messages[-1]["message"]

@pytest.mark.asyncio
async def test_forward_claw_missing_key():
    """Test missing 'claw' key in claw data results in error."""
    ws = FakeWebSocket()
    claw_data = {}
    await forward_claw(claw_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid claw" in ws.sent_messages[-1]["message"]

@pytest.mark.asyncio
async def test_forward_claw_edge_values():
    """Test edge case value 0.0 for claw is valid."""
    ws = FakeWebSocket()
    claw_data = {"claw": 0.0}

    with patch("RaspberryPI.commands.arm.forwarder.move_claw") as mock_claw:
        await forward_claw(claw_data, ws)
        mock_claw.assert_called_once_with(0.0)
        assert ws.sent_messages[-1]["status"] == "ok"

@pytest.mark.asyncio
async def test_forward_arm_missing_x():
    """Test missing 'x' key in arm data results in error."""
    ws = FakeWebSocket()
    arm_data = {"y": 0.5}
    await forward_arm(arm_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid" in ws.sent_messages[-1]["message"]

@pytest.mark.asyncio
async def test_forward_arm_missing_y():
    """Test missing 'y' key in arm data results in error."""
    ws = FakeWebSocket()
    arm_data = {"x": 0.5}
    await forward_arm(arm_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid" in ws.sent_messages[-1]["message"]

@pytest.mark.asyncio
async def test_forward_claw_none():
    """Test 'None' value in claw data results in error."""
    ws = FakeWebSocket()
    claw_data = {"claw": None}
    await forward_claw(claw_data, ws)

    assert ws.sent_messages[-1]["status"] == "error"
    assert "Invalid" in ws.sent_messages[-1]["message"]