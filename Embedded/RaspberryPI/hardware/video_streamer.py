import subprocess
import os
import signal

ffmpeg_process = None

def start_video_stream():
    global ffmpeg_process
    if ffmpeg_process is not None:
        print("Stream already running.")
        return

    print("Starting video stream...")
    command = (
        'libcamera-vid -t 0 --width 1280 --height 720 --framerate 30 '
        '--codec h264 --inline --profile baseline --nopreview -o - | '
        'ffmpeg -f h264 -i - -c copy -f mpegts '
        'srt://test.lazyloops.se:1234?pkt_size=1316&latency=50'
    )

    ffmpeg_process = subprocess.Popen(
        command,
        shell=True,
        executable="/bin/bash",
        preexec_fn=os.setsid
    )

def stop_video_stream():
    global ffmpeg_process
    if ffmpeg_process is not None:
        print("Stopping video stream...")
        os.killpg(os.getpgid(ffmpeg_process.pid), signal.SIGINT)
        ffmpeg_process.wait()
        ffmpeg_process = None
        print("Streaming stopped.")
    else:
        print("No stream running.")