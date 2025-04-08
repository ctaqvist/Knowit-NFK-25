import { spawn } from 'child_process';

function startStreamingServer(clients, port = 9000){
    const stream = spawn('ffmpeg' , [
        '-fflags', 'nobuffer', // reduce buffering for lower latency
        '-i', `srt://0.0.0.0:${port}?mode=listener`, // listen for incoming SRT connections on port 9000
        '-c:v', 'copy', // copy the video stream without re-encoding
        '-an', // disable audio processing
        '-f', 'mpegts', // output format is MPEG-TS
        'pipe:1' // send the output to stdout
    ])

    stream.stdout.on('data', (data) => {
        clients.array.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                    client.send(data)
            }
        });
    })

    stream.stderr.on('data', (data) => {
        console.error(`[ffmpeg] ${data}`);
      });
      
      stream.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
      });
}

export default startStreamingServer

