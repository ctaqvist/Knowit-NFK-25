import asyncio
import cv2
import websockets
import json
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
from av import VideoFrame

class CameraStream(VideoStreamTrack):
    def __init__(self):
        super().__init__()
        self.cap = cv2.VideoCapture(0)

    async def recv(self):
        pts, time_base = await self.next_timestamp()
        ret, frame = self.cap.read()
        if not ret:
            return None
        frame = VideoFrame.from_ndarray(frame, format="bgr24")
        frame.pts = pts
        frame.time_base = time_base
        return frame

async def main():
    pc = RTCPeerConnection()
    pc.addTrack(CameraStream())

    uri = "ws://YOUR_SERVER_IP:8080"
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({"type": "streamer"}))

        while True:
            message = await ws.recv()
            data = json.loads(message)

            if 'sdp' in data:
                await pc.setRemoteDescription(RTCSessionDescription(
                    sdp=data['sdp']['sdp'],
                    type=data['sdp']['type']
                ))
                answer = await pc.createOffer()
                await pc.setLocalDescription(answer)
                await ws.send(json.dumps({"sdp": pc.localDescription}))

            elif 'candidate' in data:
                await pc.addIceCandidate(data['candidate'])

if __name__ == "__main__":
    asyncio.run(main())
