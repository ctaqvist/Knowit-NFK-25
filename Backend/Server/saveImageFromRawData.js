import fs from 'fs';

export default function SaveImage(data, format = `image_${new Date().toISOString().replace(/[:.]/g, '-')}`) {
    const buffer = Buffer.from(data, 'base64');
    const outputPath = `./img/${format}.jpg`;
    fs.mkdirSync('./img', { recursive: true }); // Ensure the directory exists
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image saved to ${outputPath}`);
};