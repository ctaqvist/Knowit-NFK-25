
import asyncio
import time
import json
import logging
from communication.serial_helper import arduino


logging.basicConfig(
    format="%(asctime)s.%(msecs)03d [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",    # bara timmar:minuter:sekunder
    level=logging.DEBUG
)
# Skapa en logger-variabel som vi kan använda
logger = logging.getLogger("stress")

async def stress_test(rate_hz: float, duration_s: float = 10.0):
    """
    Skickar ett enkelt kommando i given takt under duration_s sekunder.
    Mäter och loggar hur lång tid each arduino.send() tar.
    """
    interval = 1.0 / rate_hz
    end_time = time.time() + duration_s
    count = 0

    logger.info(f"Startar stress-test: {rate_hz:.1f} Hz i {duration_s:.1f}s")

    while time.time() < end_time:
        cmd = json.dumps({"command": "LIGHTS_ON"})
        t0 = time.perf_counter()
        ok = await arduino.send(cmd)
        dt = (time.perf_counter() - t0) * 1000  # ms
        if not ok:
            logger.warning(f"Misslyckades skicka efter {dt:.1f} ms")
        else:
            logger.debug(f"OK send took {dt:.1f} ms")
        count += 1
        await asyncio.sleep(interval)

    logger.info(f"Stress-test klart. Totalt skickade: {count}")

if __name__ == "__main__":
    import sys

    # Läs argument från kommandorad om du vill
    hz = float(sys.argv[1]) if len(sys.argv) > 1 else 5.0
    dur = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0

    asyncio.run(stress_test(hz, dur))
