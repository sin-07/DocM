/*
==========================================
  GALLERY ROUTES
==========================================
*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get all gallery images
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const [results] = await db.query('SELECT * FROM gallery ORDER BY created_at DESC');
        res.json(results);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery', message: error.message });
    }
});

// Get images by category
router.get('/category/:category', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { category } = req.params;
        const [results] = await db.query('SELECT * FROM gallery WHERE category = ? ORDER BY created_at DESC', [category]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching gallery by category:', error);
        res.status(500).json({ error: 'Failed to fetch gallery', message: error.message });
    }
});

// Upload image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        
        const db = req.app.locals.db;
        const { category, description } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;
        
        const [result] = await db.query(
            'INSERT INTO gallery (image_url, category, description) VALUES (?, ?, ?)',
            [imageUrl, category || 'general', description || '']
        );
        
        res.json({ 
            success: true,
            id: result.insertId, 
            imageUrl, 
            category: category || 'general', 
            description: description || '',
            message: 'Image uploaded successfully'
        });
        
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image', message: error.message });
    }
});

// Delete image
router.delete('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        
        // Get image info first to delete file
        const [images] = await db.query('SELECT image_url FROM gallery WHERE id = ?', [id]);
        
        if (images.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        // Delete from database
        await db.query('DELETE FROM gallery WHERE id = ?', [id]);
        
        // Delete physical file
        const imagePath = path.join(__dirname, '..', images[0].image_url);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
        res.json({ success: true, message: 'Image deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image', message: error.message });
    }
});

module.exports = router;
