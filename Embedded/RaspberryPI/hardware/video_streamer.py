from picamera2.encoders import H264Encoder
from picamera2.outputs import FileOutput
import subprocess
import os
import time
from hardware.camera_instance import get_camera_instance  

encoder = H264Encoder(bitrate=2000000)
output_path = "/tmp/stream.h264"
ffmpeg_process = None
is_streaming = False

def start_video_stream():
    global is_streaming, ffmpeg_process

    if is_streaming:
        print("Stream already running.")
        return

    print("Starting local video recording to /tmp/stream.h264...")

    picam2 = get_camera_instance()  
    output = FileOutput(output_path)
    picam2.start_recording(encoder, output)

    print("Waiting for stream data to appear...")
    for _ in range(20):
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            break
        time.sleep(0.1)

    print("📡 Launching ffmpeg to SRT endpoint...")
    ffmpeg_process = subprocess.Popen([
        "ffmpeg",
        "-re",
        "-stream_loop", "-1",
        "-i", output_path,
        "-c:v", "copy",
        "-f", "mpegts",
        "srt://test.lazyloops.se:1234?pkt_size=1316&latency=50"
    ])
    is_streaming = True

def stop_video_stream():
    global is_streaming, ffmpeg_process

    if not is_streaming:
        print("No stream running.")
        return

    print("Stopping video stream...")

    picam2 = get_camera_instance()
    picam2.stop_recording()

    if ffmpeg_process:
        ffmpeg_process.terminate()
        ffmpeg_process.wait()
        ffmpeg_process = None

    is_streaming = False
    print("Stream stopped.")
