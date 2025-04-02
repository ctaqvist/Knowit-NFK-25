const path = require('path');
const WebSocket = require('ws');
const { spawn } = require('child_process');



const wss = new WebSocket.Server({ port: 9000 });
const clients = new Set();

const wsTimestampServer = new WebSocket.Server({ port: 9100 });
const timestampClients = new Set();

wsTimestampServer.on('connection', (socket) => {
  timestampClients.add(socket);
  console.log('Client connected to timestamp WS');

  socket.on('close', () => {
    timestampClients.delete(socket);
  });
});


wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });
});

const ffmpeg = spawn('ffmpeg', [
  '-fflags', 'nobuffer',
  '-i', 'srt://0.0.0.0:1234?mode=listener',
  '-c:v', 'copy',
  '-an',
  '-f', 'mpegts',
  'pipe:1'
]);

ffmpeg.stdout.on('data', (chunk) => {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(chunk);
    }
  }
});

ffmpeg.stderr.on('data', (data) => {
  console.error(`[ffmpeg] ${data}`);
});

ffmpeg.on('close', (code) => {
  console.log(`FFmpeg exited with code ${code}`);
});
