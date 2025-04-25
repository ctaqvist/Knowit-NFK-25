import pytest
import json
from unittest.mock import AsyncMock, patch
from commands.rover.lights import handle_light_command

@pytest.mark.asyncio
async def test_light_on_command():
    mock_websocket = AsyncMock()

    with patch("communication.serial_helper.arduino.send") as mock_send:
        await handle_light_command("light_on", mock_websocket)

        mock_send.assert_called_once_with(json.dumps({
            "command": "light",
            "value": "on"
        }))
        sent_response = json.loads(mock_websocket.send.call_args[0][0])
        assert "Light turned ON" in sent_response["response"]

@pytest.mark.asyncio
async def test_light_off_command():
    mock_websocket = AsyncMock()

    with patch("communication.serial_helper.arduino.send") as mock_send:
        await handle_light_command("light_off", mock_websocket)

        mock_send.assert_called_once_with(json.dumps({
            "command": "light",
            "value": "off"
        }))
        sent_response = json.loads(mock_websocket.send.call_args[0][0])
        assert "Light turned OFF" in sent_response["response"]

@pytest.mark.asyncio
async def test_unknown_light_command():
    mock_websocket = AsyncMock()

    with patch("communication.serial_helper.arduino.send") as mock_send:
        await handle_light_command("blink_blue", mock_websocket)

        mock_send.assert_called_once_with("blink_blue")  
        sent_response = json.loads(mock_websocket.send.call_args[0][0])
        assert sent_response["response"] == "Command sent: blink_blue"
