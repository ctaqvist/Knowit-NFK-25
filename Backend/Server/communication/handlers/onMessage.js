import parseJson from '../utils/parseJson.js';
import containsImageData from '../utils/containsImageData.js';
import saveImage from '../helpers/saveImageFromRawData.js';
import sendPong from '../utils/sendPong.js';
import forwardMessage from '../utils/forwardMessage.js';

export default function onMessage(ws, msg, clients) {
    console.log(`[Message]: ${msg}`);

    if (msg === 'ping') {
        sendPong(ws);
        return;
    }

    const parsed = parseJson(msg);

    if (containsImageData(parsed)) {
        saveImage(parsed.image_base64);
        return;
    }

    forwardMessage(parsed, clients, ws);
}
