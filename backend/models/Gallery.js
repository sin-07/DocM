const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'general',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
