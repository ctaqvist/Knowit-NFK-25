import { spawn } from 'child_process';
import { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';

function astartStreamingServer(ports) {
  const wss = new WebSocketServer({ port: ports.ouputPort });
  const clients = new Set();

  // Output
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });
  });

  // Input
  const stream = spawn('ffmpeg', [
    '-fflags', 'nobuffer', // reduce buffering for lower latency
    '-i', `srt://0.0.0.0:${ports.inputPort}?mode=listener`, // listen for incoming SRT connections on the given port
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