const sharp = require('sharp');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const processImage = async (imageUrl, outputDir) => {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');

    const buffer = await response.buffer();
    const outputFilePath = path.join(outputDir, path.basename(imageUrl));

    await sharp(buffer)
        .jpeg({ quality: 50 })
        .toFile(outputFilePath);

    return outputFilePath;
};

module.exports = { processImage };
