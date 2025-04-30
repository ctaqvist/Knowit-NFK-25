import json
import pytest
from unittest.mock import MagicMock, patch
from RaspberryPI.commands.rover.forwarder import forward_joystick_to_arduino


# Helper to call forwarder with patched arduino.send
async def run_and_capture_send(data):
    with patch("RaspberryPI.commands.rover.forwarder.arduino.send", new_callable=MagicMock) as mock_send:
        await forward_joystick_to_arduino(data)
        return mock_send


@pytest.mark.asyncio
async def test_should_send_when_valid_data():
    """Should send correctly rounded x/y values when data is valid."""
    steer_data = {"x": 1.23456, "y": -4.56789}
    expected_json = json.dumps({
        "command": "steer",
        "x": 1.23,
        "y": -4.57
    })

    with patch("RaspberryPI.commands.rover.forwarder.arduino.send", new_callable=MagicMock) as mock_send:
        await forward_joystick_to_arduino(steer_data)
        mock_send.assert_called_once_with(expected_json)


@pytest.mark.asyncio
@pytest.mark.parametrize("data", [
    {"x": "not_a_float"},
    {"y": 2.5},
    {"x": -3.4},
    {"x": None, "y": None},
])
async def test_should_not_send_when_invalid_data(data):
    """Should not send if input data is missing or invalid."""
    mock_send = await run_and_capture_send(data)
    mock_send.assert_not_called()


@pytest.mark.asyncio
async def test_should_send_when_stringified_numbers():
    """Should send float values if x/y are valid strings."""
    data = {"x": "1", "y": "2"}
    expected_json = json.dumps({
        "command": "steer",
        "x": 1.0,
        "y": 2.0
    })

    with patch("RaspberryPI.commands.rover.forwarder.arduino.send", new_callable=MagicMock) as mock_send:
        await forward_joystick_to_arduino(data)
        mock_send.assert_called_once_with(expected_json)