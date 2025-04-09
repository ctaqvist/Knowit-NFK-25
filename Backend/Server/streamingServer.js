import { spawn } from 'child_process';
import { WebSocket } from 'ws';

function startStreamingServer(clients, port = 9000){
    const stream = spawn('ffmpeg' , [
        '-fflags', 'nobuffer', // reduce buffering for lower latency
        '-i', `srt://0.0.0.0:${port}?mode=listener`, // listen for incoming SRT connections on port 9000
        '-c:v', 'copy', // copy the video stream without re-encoding
        '-an', // disable audio processing
        '-f', 'mpegts', // output format is MPEG-TS
        'pipe:1' // send the output to stdout
    ])

    stream.stdout.on('data', (chunk) => {
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(chunk);
    }
  }
    })

    stream.stderr.on('data', (data) => {
        console.error(`[ffmpeg] ${data}`);
      });
      
      stream.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
      });
}

export default startStreamingServer

