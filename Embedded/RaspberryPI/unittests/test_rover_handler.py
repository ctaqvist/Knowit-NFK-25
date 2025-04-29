import pytest
from unittest.mock import MagicMock, patch
from RaspberryPI.commands.rover.handler import process_command

@pytest.mark.asyncio
async def test_process_command_with_steer():
    websocket = MagicMock()
    params = {"steer": {"x": 1.0, "y": 1.0}}
    with patch("RaspberryPI.commands.rover.handler.forward_joystick_to_arduino") as mock_forward:
        await process_command(websocket, "any", params)
        mock_forward.assert_awaited_once_with(params["steer"])

@pytest.mark.asyncio
async def test_process_command_pic():
    websocket = MagicMock()
    with patch("RaspberryPI.commands.rover.handler.forward_joystick_to_arduino") as mock_pic:
        await process_command(websocket, "PIC", {})
        mock_pic.assert_awaited_once_with(websocket)

@pytest.mark.asyncio
async def test_process_command_start_stream():
    websocket = MagicMock()
    with patch("RaspberryPI.commands.rover.handler.forward_joystick_to_arduino") as mock_stream:
        await process_command(websocket, "START_STREAM", {})
        mock_stream.assert_awaited_once_with(websocket)

@pytest.mark.asyncio
async def test_process_command_stop_stream():
    websocket = MagicMock()
    with patch("RaspberryPI.commands.rover.handler.forward_joystick_to_arduino") as mock_stop:
        await process_command(websocket, "STOP_STREAM", {})
        mock_stop.assert_awaited_once_with(websocket)

@pytest.mark.asyncio
async def test_process_command_light():
    websocket = MagicMock()
    with patch("RaspberryPI.commands.rover.handler.forward_joystick_to_arduino") as mock_light:
        await process_command(websocket, "light_on", {})
        mock_light.assert_awaited_once_with("light_on", websocket)

@pytest.mark.asyncio
async def test_process_command_noop(capfd):
    websocket = MagicMock()
    await process_command(websocket, "", {})
    out, _ = capfd.readouterr()
    assert "No command or steer data found" in out