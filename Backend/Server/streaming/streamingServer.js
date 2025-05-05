import { spawn } from 'child_process';
import { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';
import wsAuthCheck from '../communication/helpers/webSocketAuthMiddleware.js';

function startStreamingServer(ports) {
    const wss = new WebSocketServer({ port: ports.outputPort });
    const clients = new Set();

    // Output
    wss.on('connection', (ws, req) => {
        // Authentication check
        try{
            const decoded = wsAuthCheck(req)
            ws.token = decoded
            console.log(`${decoded.username} is connected to streaming server`)
        }
        catch{
            ws.close(4001, 'Invalid token!')
            console.log('Invalid token')
            return;
        }
        
        console.log('WebSocket client connected');
        clients.add(ws);

        ws.on('close', () => {
            console.log('WebSocket client disconnected');
            clients.delete(ws);
        });
    });

    // Start FFMPEG process, listening for the stream from rover
    startFFMPEG();

    function startFFMPEG() {
        // Input
        const streamProcess = spawn('ffmpeg', [
            '-fflags', 'nobuffer', // reduce buffering for lower latency
            '-i', `srt://0.0.0.0:${ports.inputPort}?mode=listener`, // listen for incoming SRT connections on the given port
            '-c:v', 'copy', // copy the video stream without re-encoding
            '-an', // disable audio processing
            '-f', 'mpegts', // output format is MPEG-TS
            'pipe:1' // send the output to stdout
        ])

        streamProcess.stdout.on('data', (chunk) => {
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(chunk);
                }
            }
        })

        streamProcess.stderr.on('data', (data) => {
            console.error(`[ffmpeg] ${data}`);
        });

        streamProcess.on('close', (code) => {
            console.log(`FFmpeg exited with code ${code}`);
            // Start new ffmpeg process after previous one is closed
            setTimeout(startFFMPEG, 1000);
        });
    }
}

export default startStreamingServer