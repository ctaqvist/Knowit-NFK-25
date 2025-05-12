import pytest
from unittest.mock import MagicMock, patch
import os, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, root)
from commands.rover.handler import process_command


@pytest.mark.asyncio
async def test_process_command_with_steer():
    websocket = MagicMock()
    params = {"steer": {"x": 1.0, "y": 1.0}}
    # patcha Embedded-modulen
    with patch("Embedded.RaspberryPI.commands.rover.handler.forward_joystick_to_arduino", new_callable=MagicMock) as mock_forward:
        await process_command(websocket, "anything", params)
        mock_forward.assert_awaited_once_with(params["steer"])


@pytest.mark.asyncio
async def test_process_command_pic():
    websocket = MagicMock()
    with patch("Embedded.RaspberryPI.commands.rover.handler.handle_pic_command", new_callable=MagicMock) as mock_pic:
        await process_command(websocket, "PIC", {})
        mock_pic.assert_awaited_once_with(websocket)


@pytest.mark.asyncio
async def test_process_command_start_stream():
    websocket = MagicMock()
    with patch("Embedded.RaspberryPI.commands.rover.handler.handle_stream_command", new_callable=MagicMock) as mock_stream:
        await process_command(websocket, "START_STREAM", {})
        mock_stream.assert_awaited_once_with(websocket)


@pytest.mark.asyncio
async def test_process_command_stop_stream():
    websocket = MagicMock()
    with patch("Embedded.RaspberryPI.commands.rover.handler.handle_stop_stream_command", new_callable=MagicMock) as mock_stop:
        await process_command(websocket, "STOP_STREAM", {})
        mock_stop.assert_awaited_once_with(websocket)


@pytest.mark.asyncio
async def test_process_command_light():
    websocket = MagicMock()
    with patch("Embedded.RaspberryPI.commands.rover.handler.handle_light_command", new_callable=MagicMock) as mock_light:
        await process_command(websocket, "LIGHTS_ON", {})
        mock_light.assert_awaited_once_with("LIGHTS_ON", websocket)


@pytest.mark.asyncio
async def test_process_command_noop():
    websocket = MagicMock()
    # Bör inte kasta eller skriva något
    await process_command(websocket, "UNKNOWN_CMD", {})
    # Inga await på några patchade funktioner => lugnt
    # Kontrollera att websocket.send aldrig anropades
    websocket.send.assert_not_called()