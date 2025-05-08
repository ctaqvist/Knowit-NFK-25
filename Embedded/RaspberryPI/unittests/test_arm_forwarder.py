
import pytest
import json
import asyncio
import os
import sys
from pathlib import Path

# Ensure project root on path for imports
root = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(root))

from commands.arm.arm_forwarder import forward_arm, forward_claw
from config.settings import ROVER_ID

class DummyWebSocket:
    def __init__(self):
        self.sent = []
    async def send(self, message):
        self.sent.append(json.loads(message))

# --- Arm Forward Tests ---
@pytest.mark.asyncio
async def test_forward_arm_calls_move_and_succeeds(monkeypatch):
    ws = DummyWebSocket()
    # Patch move_arm to simulate success
    import commands.arm.arm_forwarder as mod
    called = []
    monkeypatch.setattr(mod, 'move_arm', lambda x, y: called.append((x,y)))

    await forward_arm({'x': 0.5, 'y': -0.5}, ws)
    # Verify move_arm called with floats
    assert called == [(0.5, -0.5)]
    # Verify websocket message
    msg = ws.sent[-1]
    assert msg['rover_id'] == ROVER_ID
    assert msg['status'] == 'ok'
    assert msg['x'] == 0.5 and msg['y'] == -0.5
    assert 'Arm moved' in msg['response']

@pytest.mark.asyncio
async def test_forward_arm_invalid_type(monkeypatch):
    ws = DummyWebSocket()
    # invalid x causes no move
    import commands.arm.arm_forwarder as mod
    monkeypatch.setattr(mod, 'move_arm', lambda x, y: (_ for _ in ()).throw(AssertionError("Should not be called")))

    await forward_arm({'x': 'bad', 'y': 0.1}, ws)
    msg = ws.sent[-1]
    assert msg['status'] == 'error'
    assert 'Invalid x/y' in msg['message']

@pytest.mark.asyncio
async def test_forward_arm_missing_keys():
    ws = DummyWebSocket()
    # missing y
    await forward_arm({'x': 0.2}, ws)
    msg = ws.sent[-1]
    assert msg['status'] == 'error'
    assert 'Invalid x/y' in msg['message']

@pytest.mark.asyncio
async def test_forward_arm_move_error(monkeypatch):
    ws = DummyWebSocket()
    # simulate exception inside move_arm
    import commands.arm.arm_forwarder as mod
    def raise_err(x, y): raise RuntimeError('fail')
    monkeypatch.setattr(mod, 'move_arm', raise_err)

    await forward_arm({'x': 0.1, 'y': 0.2}, ws)
    msg = ws.sent[-1]
    assert msg['status'] == 'error'
    assert '[forward_arm]' in msg['message']

# --- Claw Forward Tests ---
@pytest.mark.asyncio
async def test_forward_claw_calls_move_and_succeeds(monkeypatch):
    ws = DummyWebSocket()
    import commands.arm.arm_forwarder as mod
    called = []
    monkeypatch.setattr(mod, 'move_claw', lambda c: called.append(c))

    await forward_claw({'claw': 1.0}, ws)
    assert called == [1.0]
    msg = ws.sent[-1]
    assert msg['status'] == 'ok'
    assert msg['claw'] == 1.0
    assert 'Claw moved' in msg['response']

@pytest.mark.asyncio
async def test_forward_claw_invalid_type():
    ws = DummyWebSocket()
    import commands.arm.arm_forwarder as mod
    monkeypatch = pytest.MonkeyPatch()
    # monkeypatch not needed for move_claw

    await forward_claw({'claw': 'nope'}, ws)
    msg = ws.sent[-1]
    assert msg['status'] == 'error'
    assert 'Invalid claw' in msg['message']

@pytest.mark.asyncio
async def test_forward_claw_missing_key():
    ws = DummyWebSocket()
    await forward_claw({}, ws)
    msg = ws.sent[-1]
    assert msg['status'] == 'error'
    assert 'Invalid claw' in msg['message']

@pytest.mark.asyncio
async def test_forward_claw_move_error(monkeypatch):
    ws = DummyWebSocket()
    import commands.arm.arm_forwarder as mod
    def raise_err(c): raise RuntimeError('fail claw')
    monkeypatch.setattr(mod, 'move_claw', raise_err)

    await forward_claw({'claw': 0.0}, ws)
    msg = ws.sent[-1]
    assert msg['status'] == 'error'
    assert '[forward_claw]' in msg['message']
