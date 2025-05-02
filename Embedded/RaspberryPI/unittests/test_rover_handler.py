import pytest
from unittest.mock import MagicMock, patch
from Embedded.RaspberryPI.commands.rover.handler import process_command

@pytest.mark.asyncio
async def test_process_command_with_steer():
    websocket = MagicMock()
    params = {"steer": {"x": 1.0, "y": 1.0}}
    with patch("commands.rover.handler.forward_joystick_to_arduino") as mock_forward:
        await process_command(websocket, "any", params)
        mock_forward.assert_awaited_once_with(params["steer"])

@pytest.mark.asyncio
async def test_process_command_pic():
    websocket = MagicMock()
    with patch("commands.rover.handler.take_picture") as mock_pic:
        await process_command(websocket, "PIC", {})
        mock_pic.assert_called_once_with()   

@pytest.mark.asyncio
async def test_process_command_start_stream():
    websocket = MagicMock()
    with patch("commands.rover.handler.handle_stream_command") as mock_stream:
        await process_command(websocket, "START_STREAM", {})
        mock_stream.assert_awaited_once_with(websocket)

@pytest.mark.asyncio
async def test_process_command_stop_stream():
    websocket = MagicMock()
    with patch("commands.rover.handler.handle_stop_stream_command") as mock_stop:
        await process_command(websocket, "STOP_STREAM", {})
        mock_stop.assert_awaited_once_with(websocket)

@pytest.mark.asyncio
async def test_process_command_light():
    websocket = MagicMock()
    with patch("commands.rover.handler.handle_light_command") as mock_light:
        await process_command(websocket, "LIGHT_ON", {})
        mock_light.assert_awaited_once_with("LIGHT_ON", websocket)


@pytest.mark.asyncio
async def test_process_command_noop(capfd):
    websocket = MagicMock()
    await process_command(websocket, "", {})
    out, _ = capfd.readouterr()
    assert "UNKNOWN COMMAND" in out
