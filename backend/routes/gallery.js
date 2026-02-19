/*
==========================================
  GALLERY ROUTES (MongoDB + Cloudinary)
==========================================
*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Gallery = require('../models/Gallery');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'doctor-manish-gallery',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Get all gallery images
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery', message: error.message });
    }
});

// Get images by category
router.get('/category/:category', async (req, res) => {
    try {
        const images = await Gallery.find({ category: req.params.category }).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        console.error('Error fetching gallery by category:', error);
        res.status(500).json({ error: 'Failed to fetch gallery', message: error.message });
    }
});

// Upload image (to Cloudinary)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { category, description } = req.body;
        const imageUrl = req.file.path; // Cloudinary URL
        const cloudinaryId = req.file.filename; // Cloudinary public_id

        const image = new Gallery({
            imageUrl,
            cloudinaryId,
            category: category || 'general',
            description: description || ''
        });

        const saved = await image.save();

        res.json({
            success: true,
            id: saved._id,
            imageUrl,
            category: saved.category,
            description: saved.description,
            message: 'Image uploaded successfully'
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image', message: error.message });
    }
});

// Delete image (from Cloudinary + DB)
router.delete('/:id', async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete from Cloudinary
        if (image.cloudinaryId) {
            await cloudinary.uploader.destroy(image.cloudinaryId);
        }

        // Delete from database
        await Gallery.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Image deleted successfully' });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image', message: error.message });
    }
});

module.exports = router;
