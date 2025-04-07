import fs from 'fs';

export default function SaveImage(data) {
    const buffer = Buffer.from(data, 'base64');
    const outputPath = './img/image.jpg';
    fs.mkdirSync('./img', { recursive: true }); // Ensure the directory exists
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image saved to ${outputPath}`);
};