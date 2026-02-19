/*
==========================================
  GALLERY - FRONTEND DISPLAY
  Dynamically load photos from MySQL Backend
==========================================
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    loadGalleryPhotos();
});

// Load Gallery Photos from MySQL Backend
async function loadGalleryPhotos() {
    const galleryContainer = document.getElementById('dynamic-gallery-grid');
    
    if (!galleryContainer) {
        console.log('ℹ️ Gallery container not found on this page');
        return;
    }
    
    // Show loading state
    galleryContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p class="text-gray-600 mt-4">Loading gallery...</p>
        </div>
    `;
    
    try {
        // Fetch photos from MySQL Backend API
        const response = await fetch(API_ENDPOINTS.GALLERY);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const photos = await response.json();
        
        if (!photos || photos.length === 0) {
            console.log('ℹ️ No photos in database, showing default gallery');
            showDefaultGallery(galleryContainer);
            return;
        }
        
        // Clear loading state
        galleryContainer.innerHTML = '';
        
        // Display photos
        photos.forEach((photo) => {
            const photoElement = createGalleryPhotoElement(photo);
            galleryContainer.appendChild(photoElement);
        });
        
        console.log(`✅ Loaded ${photos.length} photos from MySQL database`);
        
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        showDefaultGallery(galleryContainer);
    }
}

// Create Gallery Photo Element
function createGalleryPhotoElement(photo) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    // Use Cloudinary URL directly if absolute, otherwise prepend backend URL
    const imageUrl = photo.imageUrl && photo.imageUrl.startsWith('http')
        ? photo.imageUrl
        : `${API_URL.replace('/api', '')}${photo.imageUrl || ''}`;
    
    div.innerHTML = `
        <img 
            src="${imageUrl}" 
            alt="${photo.description || photo.category || 'Gallery Photo'}" 
            class="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
            loading="lazy"
            onclick="openLightbox('${imageUrl}')"
        >
    `;
    
    return div;
}

// Show Default Gallery (Fallback)
function showDefaultGallery(container) {
    container.innerHTML = `
        <img src="https://www.orthopatna.com/wp-content/uploads/2021/01/1.jpg" alt="Clinic 1" class="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
        <img src="https://www.orthopatna.com/wp-content/uploads/2021/01/3.jpg" alt="X-Ray Machine" class="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
        <img src="https://www.orthopatna.com/wp-content/uploads/2021/01/4.jpg" alt="Blood Test" class="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
        <img src="https://www.orthopatna.com/wp-content/uploads/2021/01/2-1-1.jpg" alt="Clinic" class="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
    `;
}

// Simple Lightbox for Image Preview
window.openLightbox = function(imageUrl) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4';
    lightbox.style.cursor = 'pointer';
    
    lightbox.innerHTML = `
        <div class="relative max-w-5xl w-full">
            <button class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition z-10">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageUrl}" alt="Full size" class="w-full h-auto max-h-[90vh] object-contain rounded-lg">
        </div>
    `;
    
    // Close lightbox on click
    lightbox.addEventListener('click', function() {
        document.body.removeChild(lightbox);
    });
    
    // Add to body
    document.body.appendChild(lightbox);
};

console.log('✅ Gallery script loaded');
