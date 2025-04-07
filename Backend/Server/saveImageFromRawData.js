import fs from 'fs';

export default function SaveImage(data) {
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync('./img/image.jpg', buffer);
};