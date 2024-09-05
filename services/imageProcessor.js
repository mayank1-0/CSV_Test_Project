const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Fetches an image from a URL and compresses it.
 * @param {string} imageUrl - URL of the image to be processed.
 * @param {string} outputDir - Directory to save the processed image.
 * @returns {Promise<string>} - URL of the processed image.
 */
const processImage = async (imageUrl, outputDir) => {
    try {
        // Generate a unique filename
        const filename = path.basename(imageUrl);
        const outputFilePath = path.join(outputDir, filename);

        // Fetch the image
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer',
        });

        // Compress the image
        await sharp(response.data)
            .resize({ width: 800 }) // Example: Resize to a width of 800px (maintaining aspect ratio)
            .jpeg({ quality: 50 }) // Compress to 50% quality
            .toFile(outputFilePath);

        // Generate a URL for the processed image
        const processedImageUrl = `https://your-domain.com/processed-images/${filename}`;
        return processedImageUrl;
    } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error);
        throw error;
    }
};

module.exports = { processImage };
