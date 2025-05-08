# Embedded/RaspberryPI/unittests/test_websocket_serial_extended.py
import pytest
import asyncio
import json
import os
from communication.websocket_communication import handle_serial_message, ROVER_ID
# Helper for tests that use nonlocal_set

def nonlocal_set(name, val):
    globals()[name] = val
import sys
from pathlib import Path

# Ensure project root on path for imports
root = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(root))

class DummyWebSocket:
    def __init__(self, has_drain=False):
        self.sent = []
        if has_drain:
            async def drain():
                return
            self.drain = drain

    async def send(self, message):
        self.sent.append(json.loads(message))

@pytest.mark.asyncio
async def test_only_battery_level():
    ws = DummyWebSocket()
    data = {"Battery_level": 0.42}
    monkey = pytest.MonkeyPatch()
    monkey.setenv  # no shutdown
    await handle_serial_message(data, ws)
    assert len(ws.sent) == 1
    assert ws.sent[0] == {"type": "battery_level", "rover_id": ROVER_ID, "value": 0.42}

@pytest.mark.asyncio
async def test_only_warning_signal():
    ws = DummyWebSocket()
    data = {"Warning_signal": False}
    await handle_serial_message(data, ws)
    assert ws.sent == [{"type": "low_battery_warning", "rover_id": ROVER_ID, "value": False}]

@pytest.mark.asyncio
async def test_only_sleep_mode_false(monkeypatch):
    ws = DummyWebSocket(has_drain=True)
    data = {"Sleep_mode": False}
    called = False
    monkeypatch.setattr(os, "system", lambda cmd: (_ for _ in ()).throw(AssertionError("shutdown not called")))
    await handle_serial_message(data, ws)
    assert ws.sent == [{"type": "sleep_mode", "rover_id": ROVER_ID, "value": False}]

@pytest.mark.asyncio
async def test_only_sleep_mode_true_with_drain(monkeypatch):
    ws = DummyWebSocket(has_drain=True)
    data = {"Sleep_mode": True}
    shutdown = False
    def fake(cmd):
        nonlocal shutdown
        shutdown = True
    monkeypatch.setattr(os, "system", fake)
    await handle_serial_message(data, ws)
    assert ws.sent[0]["type"] == "sleep_mode"
    await asyncio.sleep(0)
    assert shutdown

@pytest.mark.asyncio
async def test_only_sleep_mode_true_without_drain(monkeypatch):
    ws = DummyWebSocket(has_drain=False)
    data = {"Sleep_mode": True}
    shutdown = False
    def fake(cmd):
        nonlocal shutdown
        shutdown = True
    monkeypatch.setattr(os, "system", fake)
    await handle_serial_message(data, ws)
    assert ws.sent[0]["type"] == "sleep_mode"
    await asyncio.sleep(0.2)
    assert shutdown

@pytest.mark.asyncio
async def test_combined_battery_and_warning():
    ws = DummyWebSocket()
    data = {"Battery_level": 0.55, "Warning_signal": True}
    await handle_serial_message(data, ws)
    types = [m["type"] for m in ws.sent]
    assert types == ["battery_level", "low_battery_warning"]

@pytest.mark.asyncio
async def test_all_three_with_sleep(monkeypatch):
    ws = DummyWebSocket(has_drain=True)
    data = {"Battery_level": 0.88, "Warning_signal": False, "Sleep_mode": True}
    shutdown = False
    monkeypatch.setattr(os, "system", lambda cmd: nonlocal_set('shutdown_flag', True))
    await handle_serial_message(data, ws)
    types = [m['type'] for m in ws.sent]
    assert types == ['battery_level', 'low_battery_warning', 'sleep_mode']
    await asyncio.sleep(0)
    assert shutdown_flag

@pytest.mark.asyncio
async def test_irrelevant_keys():
    ws = DummyWebSocket()
    data = {"Battery_level": 0.2, "foo": 123}
    await handle_serial_message(data, ws)
    assert len(ws.sent) == 1
    assert ws.sent[0]["type"] == "battery_level"
