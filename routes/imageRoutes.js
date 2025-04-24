const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Save uploads to ./uploads directory

// Import controller
const imageController = require('../controllers/imageController');

// Health check endpoint
router.get('/health', imageController.getHealth);

// Generate image from prompt
router.post('/generate-image', imageController.generateImage);

// Edit image with prompt (upload PNG file)
router.post('/edit-image', upload.single('image'), imageController.editImage);

// Generate variations from an uploaded image
router.post('/generate-variations', upload.single('image'), imageController.generateVariations);

// Get recent image operations
router.get('/history', imageController.getHistory);

// Get image details by operation ID
router.get('/image/:id', imageController.getImageById);

module.exports = router;