# Unit Tests for Arm Forwarding

This directory contains unit tests for the Raspberry Pi's arm forwarding logic, specifically the `forward_arm` and `forward_claw` functions in `commands/arm/forwarder.py`.

## Purpose
Ensure robust behavior of the arm and claw forwarding functions by:
- Validating correct data handling
- Testing responses to edge cases and invalid inputs
- Verifying expected WebSocket responses
- Mocking all hardware interaction (e.g., `move_arm`, `move_claw`)

## Test Cases Covered
- Valid arm and claw movements
- Missing or invalid fields
- Edge values (e.g. `0.0`, `None`)
- Ensuring no hardware calls on bad input

## Notes
- All hardware-specific modules (`RPi.GPIO`) are mocked to ensure cross-platform compatibility.
- WebSocket communication is simulated using `FakeWebSocket`.
- Tests are asynchronous and rely on `pytest-asyncio`.

## How to Run
From the project root:
```bash
pytest Embedded/RaspberryPI/unittests/test_arm_forwarder.py -v
```

Happy testing!
