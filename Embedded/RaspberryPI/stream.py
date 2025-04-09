import subprocess

def start_video_stream():
    # libcamera-vid körs och skickar videoström till stdout (-o -)
    # ffmpeg tar in strömmen från stdin (-i -) och skickar till SRT-server
    command = (
        'libcamera-vid -t 0 --width 1280 --height 720 --framerate 30 '
        '--codec h264 -o - | '
        'ffmpeg -i - -c copy -f mpegts srt://lazyloops.se:1234'
    )
    subprocess.run(command, shell=True, executable="/bin/bash") 


