/*
==========================================
  ADMIN DASHBOARD JAVASCRIPT
  MySQL Backend Integration
==========================================
*/

// Check Authentication on Page Load
document.addEventListener('DOMContentLoaded', async () => {
    const token = getAuthToken();
    
    if (!token) {
        console.log('❌ No authentication token found, redirecting to login...');
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Verify token with backend
    try {
        const response = await fetch(API_ENDPOINTS.VERIFY, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ User authenticated:', data.email);
            document.getElementById('adminEmail').textContent = data.email;
            loadGallery();
        } else {
            throw new Error('Invalid token');
        }
    } catch (error) {
        console.error('❌ Authentication failed:', error);
        removeAuthToken();
        window.location.href = 'admin-login.html';
    }
});

// ==========================================
// LOGOUT FUNCTIONALITY
// ==========================================

document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
        try {
            removeAuthToken();
            console.log('✅ Logged out successfully');
            window.location.href = 'admin-login.html';
        } catch (error) {
            console.error('❌ Logout error:', error);
            showAlert('Logout failed. Please try again.', 'error');
        }
    }
});

// ==========================================
// FILE UPLOAD HANDLING
// ==========================================

const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const imagePreviews = document.getElementById('imagePreviews');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const uploadBtn = document.getElementById('uploadBtn');

let selectedFiles = [];

// Browse button click
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

// Drop area click
dropArea.addEventListener('click', (e) => {
    if (e.target !== browseBtn && !browseBtn.contains(e.target)) {
        fileInput.click();
    }
});

// File input change
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Drag and Drop Events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
        dropArea.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
        dropArea.classList.remove('drag-over');
    }, false);
});

dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}, false);

// Handle File Selection
function handleFiles(files) {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    Array.from(files).forEach(file => {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            showAlert(`❌ ${file.name} is not a valid image type (JPG, PNG, WEBP only)`, 'error');
            return;
        }
        
        // Validate file size
        if (file.size > maxSize) {
            showAlert(`❌ ${file.name} exceeds 5MB limit`, 'error');
            return;
        }
        
        validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
        selectedFiles = [...selectedFiles, ...validFiles];
        displayPreviews();
        showAlert(`✅ ${validFiles.length} image(s) selected`, 'success');
    }
}

// Display Image Previews
function displayPreviews() {
    imagePreviews.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        imagePreviewContainer.classList.add('hidden');
        return;
    }
    
    imagePreviewContainer.classList.remove('hidden');
    
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'relative group';
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="Preview" class="upload-preview w-full rounded-lg border-2 border-gray-300">
                <button 
                    onclick="removeFile(${index})" 
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                    <i class="fas fa-times"></i>
                </button>
                <p class="text-xs text-gray-600 mt-2 truncate">${file.name}</p>
            `;
            imagePreviews.appendChild(previewDiv);
        };
        
        reader.readAsDataURL(file);
    });
}

// Remove File from Selection
window.removeFile = function(index) {
    selectedFiles.splice(index, 1);
    displayPreviews();
    
    if (selectedFiles.length === 0) {
        showAlert('All images removed', 'info');
    }
};

// ==========================================
// UPLOAD TO BACKEND
// ==========================================

uploadBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) {
        showAlert('Please select at least one image', 'error');
        return;
    }
    
    const uploadBtnText = document.getElementById('uploadBtnText');
    const uploadSpinner = document.getElementById('uploadSpinner');
    
    // Disable upload button
    uploadBtn.disabled = true;
    uploadBtnText.textContent = 'Uploading...';
    uploadSpinner.classList.remove('hidden');
    
    try {
        let successCount = 0;
        let failCount = 0;
        
        for (const file of selectedFiles) {
            try {
                await uploadImageToBackend(file);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to upload ${file.name}:`, error);
                failCount++;
            }
        }
        
        // Show results
        if (successCount > 0) {
            showAlert(`✅ Successfully uploaded ${successCount} image(s)!`, 'success');
            selectedFiles = [];
            displayPreviews();
            fileInput.value = '';
            loadGallery(); // Refresh gallery
        }
        
        if (failCount > 0) {
            showAlert(`⚠️ Failed to upload ${failCount} image(s)`, 'error');
        }
        
    } catch (error) {
        console.error('❌ Upload error:', error);
        showAlert('Upload failed. Please try again.', 'error');
    } finally {
        // Re-enable upload button
        uploadBtn.disabled = false;
        uploadBtnText.textContent = 'Upload All Images';
        uploadSpinner.classList.add('hidden');
    }
});

// Upload Single Image to Backend
async function uploadImageToBackend(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'general');
    formData.append('description', file.name);
    
    const token = getAuthToken();
    const response = await fetch(API_ENDPOINTS.GALLERY, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
    }
    
    const result = await response.json();
    console.log(`✅ Uploaded: ${file.name}`);
    return result;
}

// ==========================================
// GALLERY LOADING & DISPLAY
// ==========================================

async function loadGallery() {
    const galleryLoading = document.getElementById('galleryLoading');
    const emptyState = document.getElementById('emptyState');
    const galleryGrid = document.getElementById('galleryGrid');
    
    // Show loading
    galleryLoading.classList.remove('hidden');
    emptyState.classList.add('hidden');
    galleryGrid.classList.add('hidden');
    
    try {
        const response = await fetch(API_ENDPOINTS.GALLERY, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch gallery');
        }
        
        const photos = await response.json();
        
        if (photos.length === 0) {
            galleryLoading.classList.add('hidden');
            emptyState.classList.remove('hidden');
            updateStats(0, 0, null);
            return;
        }
        
        // Clear gallery
        galleryGrid.innerHTML = '';
        
        let totalSize = 0;
        let latestUpload = null;
        
        photos.forEach((photo) => {
            totalSize += photo.size || 0;
            
            const photoDate = photo.created_at ? new Date(photo.created_at) : null;
            if (!latestUpload || (photoDate && photoDate > latestUpload)) {
                latestUpload = photoDate;
            }
            
            // Create photo card
            const photoCard = createPhotoCard(photo);
            galleryGrid.appendChild(photoCard);
        });
        
        // Update stats
        updateStats(photos.length, totalSize, latestUpload);
        
        // Show gallery
        galleryLoading.classList.add('hidden');
        galleryGrid.classList.remove('hidden');
        
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        galleryLoading.classList.add('hidden');
        showAlert('Failed to load gallery. Please refresh the page.', 'error');
    }
}

// Create Photo Card Element
function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card bg-white shadow-lg';
    
    const uploadDate = photo.created_at 
        ? new Date(photo.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
        : 'Unknown date';
    
    // Create full URL for image
    const imageUrl = photo.image_url.startsWith('http') 
        ? photo.image_url 
        : `http://localhost:3000${photo.image_url}`;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${photo.description || 'Gallery image'}" loading="lazy">
        <div class="photo-overlay">
            <p class="text-white text-sm font-semibold truncate mb-2">${photo.description || 'Image'}</p>
            <div class="flex space-x-2">
                <button onclick="viewPhoto('${imageUrl}')" class="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded transition text-sm">
                    <i class="fas fa-eye mr-1"></i>View
                </button>
                <button onclick="deletePhoto(${photo.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition text-sm">
                    <i class="fas fa-trash-alt mr-1"></i>Delete
                </button>
            </div>
            <p class="text-white/70 text-xs mt-2">${uploadDate}</p>
        </div>
    `;
    
    return card;
}

// Update Statistics
function updateStats(totalPhotos, totalSize, lastUpload) {
    document.getElementById('totalPhotos').textContent = totalPhotos;
    
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    document.getElementById('storageUsed').textContent = `${sizeMB} MB`;
    
    if (lastUpload) {
        const timeAgo = getTimeAgo(lastUpload);
        document.getElementById('lastUpload').textContent = timeAgo;
    } else {
        document.getElementById('lastUpload').textContent = 'Never';
    }
}

// Get Time Ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [key, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

// ==========================================
// PHOTO ACTIONS
// ==========================================

// View Photo in New Tab
window.viewPhoto = function(url) {
    window.open(url, '_blank');
};

// Delete Photo
let photoToDelete = null;

window.deletePhoto = function(photoId) {
    photoToDelete = photoId;
    document.getElementById('deleteModal').classList.remove('hidden');
    document.getElementById('deleteModal').classList.add('flex');
};

// Cancel Delete
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('deleteModal').classList.add('hidden');
    document.getElementById('deleteModal').classList.remove('flex');
    photoToDelete = null;
});

// Confirm Delete
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    if (!photoToDelete) return;
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Deleting...';
    
    try {
        const response = await fetch(`${API_ENDPOINTS.GALLERY}/${photoToDelete}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete photo');
        }
        
        console.log('✅ Photo deleted successfully');
        showAlert('✅ Photo deleted successfully', 'success');
        
        // Close modal
        document.getElementById('deleteModal').classList.add('hidden');
        document.getElementById('deleteModal').classList.remove('flex');
        
        // Reload gallery
        loadGallery();
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        showAlert('Failed to delete photo. Please try again.', 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-trash-alt mr-2"></i>Delete';
        photoToDelete = null;
    }
});

// ==========================================
// REFRESH GALLERY
// ==========================================

document.getElementById('refreshBtn').addEventListener('click', () => {
    loadGallery();
    showAlert('Gallery refreshed', 'info');
});

// ==========================================
// ALERT FUNCTION
// ==========================================

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('uploadAlert');
    const alertColors = {
        success: 'bg-green-50 border-green-500 text-green-700',
        error: 'bg-red-50 border-red-500 text-red-700',
        info: 'bg-blue-50 border-blue-500 text-blue-700'
    };
    
    const alertIcon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    alertContainer.innerHTML = `
        <div class="${alertColors[type]} border-l-4 p-4 rounded-lg flex items-center">
            <i class="fas ${alertIcon[type]} mr-3 text-lg"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// ==========================================
// INITIALIZE
// ==========================================

console.log('✅ Admin dashboard initialized');
