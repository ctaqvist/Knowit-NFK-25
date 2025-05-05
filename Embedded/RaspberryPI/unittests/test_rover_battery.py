import json
import pytest
from unittest.mock import AsyncMock, patch

# Simulerad WebSocket-klass
class FakeWebSocket:
    def __init__(self):
        self.sent_messages = []

    async def send(self, message):
        self.sent_messages.append(json.loads(message))

# Funktioner under test (simulerade här, men i verklig kod importeras de)
async def handle_battery_level(level:float,websocket):
    data = {
        "type":"BATTERY_LEVEL",
        "value":level
    }
    print(f"[Battery] Level received: {level}")
    return await websocket.send(json.dumps(data))

async def handle_sleep_signal(trigger: bool, websocket):
    data = {
        "type": "SLEEP_MODE",
        "value": trigger
    }
    if trigger:
        print("[SleepMode] Trigger received: going to sleep.")
        await websocket.send(json.dumps(data))
        return "shutdown_triggered"
    else:
        print("[SleepMode] Battery ok - not sleeping.")
        return await websocket.send(json.dumps(data))

async def handle_low_battery_warning(trigger: bool, websocket):
    data = {
        "type": "LOW_BATTERY_WARNING",
        "value": trigger
    }
    print(f"[Battery] Low battery warning: {trigger}")
    return await websocket.send(json.dumps(data))

# === TESTER ===

@pytest.mark.asyncio
async def test_handle_battery_level():
    ws = FakeWebSocket()
    await handle_battery_level(0.75, ws)
    assert ws.sent_messages[-1] == {"type": "BATTERY_LEVEL", "value": 0.75}

@pytest.mark.asyncio
async def test_handle_battery_level_zero():
    ws = FakeWebSocket()
    await handle_battery_level(0.0, ws)
    assert ws.sent_messages[-1] == {"type": "BATTERY_LEVEL", "value": 0.0}

@pytest.mark.asyncio
async def test_handle_battery_level_full():
    ws = FakeWebSocket()
    await handle_battery_level(1.0, ws)
    assert ws.sent_messages[-1] == {"type": "BATTERY_LEVEL", "value": 1.0}

@pytest.mark.asyncio
async def test_handle_battery_level_low_edge():
    ws = FakeWebSocket()
    await handle_battery_level(0.04, ws)
    assert ws.sent_messages[-1] == {"type": "BATTERY_LEVEL", "value": 0.04}

@pytest.mark.asyncio
async def test_handle_battery_level_midrange():
    ws = FakeWebSocket()
    await handle_battery_level(0.56, ws)
    assert ws.sent_messages[-1] == {"type": "BATTERY_LEVEL", "value": 0.56}

@pytest.mark.asyncio
async def test_handle_sleep_signal_true():
    ws = FakeWebSocket()
    result = await handle_sleep_signal(True, ws)
    assert ws.sent_messages[-1] == {"type": "SLEEP_MODE", "value": True}
    assert result == "shutdown_triggered"

@pytest.mark.asyncio
async def test_handle_sleep_signal_false():
    ws = FakeWebSocket()
    await handle_sleep_signal(False, ws)
    assert ws.sent_messages[-1] == {"type": "SLEEP_MODE", "value": False}

@pytest.mark.asyncio
async def test_handle_sleep_signal_returns_none_when_false():
    ws = FakeWebSocket()
    result = await handle_sleep_signal(False, ws)
    assert result is None

@pytest.mark.asyncio
async def test_handle_low_battery_warning_true():
    ws = FakeWebSocket()
    await handle_low_battery_warning(True, ws)
    assert ws.sent_messages[-1] == {"type": "LOW_BATTERY_WARNING", "value": True}

@pytest.mark.asyncio
async def test_handle_low_battery_warning_false():
    ws = FakeWebSocket()
    await handle_low_battery_warning(False, ws)
    assert ws.sent_messages[-1] == {"type": "LOW_BATTERY_WARNING", "value": False}

@pytest.mark.asyncio
async def test_handle_full_payload():
    ws = FakeWebSocket()
    # Simulera ett komplett paket
    await handle_battery_level(0.56, ws)
    await handle_low_battery_warning(True,ws)
    result = await handle_sleep_signal(True,ws)

    assert ws.sent_messages[0] == {"type":"BATTERY_LEVEL","value":0.56}
    assert ws.sent_messages[1] == {"type":"LOW_BATTERY_WARNING","value":True}
    assert ws.sent_messages[2] == {"type":"SLEEP_MODE","value":True}
    assert result == "shutdown_triggered"