/**
 * OpenAI Service
 * Handles all communication with OpenAI APIs.
 */

const { OpenAI } = require('openai');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an image from text prompt
 * @param {string} prompt
 * @returns {Promise<string>} image URL
 */
exports.generateImageFromPrompt = async (prompt) => {
    // Use OpenAI's image generation API (DALL·E model)
    const response = await openai.images.generate({
        prompt,
        n: 1,
        size: '1024x1024'
    });
    return response.data[0].url;
};

/**
 * Edit an uploaded image with a prompt
 * @param {string} imagePath
 * @param {string} prompt
 * @returns {Promise<string>} image URL
 */
exports.editImageWithPrompt = async (imagePath, prompt) => {
    // Ensure image is readable PNG, 256x256 to 1024x1024 square
    const response = await openai.images.edit({
        image: fs.createReadStream(imagePath),
        prompt,
        n: 1,
        size: '1024x1024'
    });
    return response.data[0].url;
};

/**
 * Generate N variations for an uploaded image
 * @param {string} imagePath
 * @returns {Promise<string[]>} array of image URLs
 */
exports.generateVariationsFromImage = async (imagePath) => {
    // Again, only square PNG is supported!
    const response = await openai.images.createVariation({
        image: fs.createReadStream(imagePath),
        n: 3,
        size: '1024x1024'
    });
    return response.data.map(item => item.url);
};