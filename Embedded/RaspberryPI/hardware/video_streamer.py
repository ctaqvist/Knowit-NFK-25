from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FileOutput
import subprocess
import os
import time

from hardware.camera_instance import get_camera_instance, release_camera_instance

# Global flags
encoder = H264Encoder(bitrate=2000000)
output_path = "/tmp/stream.h264"
ffmpeg_process = None
is_streaming = False


def wait_until_camera_free(timeout=3):
    """
    Waits until /dev/video0 is not used by any process.
    Returns True if camera is free within the timeout, otherwise False.
    """
    start = time.time()
    while time.time() - start < timeout:
        result = subprocess.run(["lsof", "/dev/video0"], capture_output=True, text=True)

        # Skip header line (first line), then check if any process holds the device
        lines = result.stdout.strip().split("\n")[1:]  # First line is headers

        if not lines:
            return True  # Device is free

        time.sleep(0.1)

    return False

def start_video_stream():
    global is_streaming, ffmpeg_process

    if is_streaming:
        print("Stream already running.")
        return

    print("Starting local video recording to /tmp/stream.h264...")

    # Remove old stream file if it exists
    if os.path.exists(output_path):
        try:
            os.remove(output_path)
            print("[INFO] Removed old stream.h264 file.")
        except Exception as e:
            print(f"[ERROR] Could not remove old stream file: {e}")
            return

    time.sleep(0.2)  # Safety buffer before attempting to use the camera

    if not wait_until_camera_free():
        print("[ERROR] Camera is still busy. Aborting stream start.")
        return

    try:
        picam2 = get_camera_instance()
        output = FileOutput(output_path)
        picam2.start_recording(encoder, output)
    except RuntimeError as e:
        print(f"[ERROR] Failed to start recording: {e}")
        return

    print("Waiting for stream data to appear...")
    for _ in range(20):
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            break
        time.sleep(0.1)

    print("Launching ffmpeg to SRT endpoint...")
    ffmpeg_process = subprocess.Popen([
        "ffmpeg",
        "-re",
        "-stream_loop", "-1",
        "-i", output_path,
        "-c:v", "copy",
        "-f", "mpegts",
        "srt://terrax9.se:1234?pkt_size=1316&latency=50"
    ])
    is_streaming = True
    print("Video stream started.")



def stop_video_stream():
    """
    Stops the local stream and releases the camera and FFmpeg process.
    """
    global is_streaming, ffmpeg_process

    if not is_streaming:
        print("No stream running.")
        return

    print("Stopping video stream...")

    # Terminate the FFmpeg subprocess
    if ffmpeg_process:
        ffmpeg_process.terminate()
        ffmpeg_process.wait()
        ffmpeg_process = None
        print("FFmpeg process terminated.")

    # Properly close the camera and release the global instance
    try:
        picam2 = get_camera_instance()
        picam2.stop_recording()
        picam2.close()  # Fully release system-level camera resources
        release_camera_instance()  # Reset the singleton to allow reinitialization
        print("Camera released.")
    except Exception as e:
        print(f"[ERROR] Failed to release camera: {e}")

    is_streaming = False
    print("Stream stopped.")
    time.sleep(0.3)  # Give the OS a short delay to finalize camera release
