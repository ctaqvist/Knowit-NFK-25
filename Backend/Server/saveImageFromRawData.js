import fs from 'fs';

// Takes a string of data and saves it as an jpg image
export default function SaveImage(data, format = `image_${new Date().toISOString().replace(/[:.]/g, '-')}`) {
    const buffer = Buffer.from(data, 'base64');
    const outputPath = `./img/${format}.jpg`;
    fs.mkdirSync('./img', { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image saved to ${outputPath}`);
};