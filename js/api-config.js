/*
==========================================
  API CONFIGURATION
  MongoDB Backend Connection
==========================================
*/

// API Base URL - Auto-detects production vs local
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';  // Same domain — Vercel serverless handles /api/*

// API Endpoints
const API_ENDPOINTS = {
    // Authentication
    LOGIN: `${API_URL}/auth/login`,
    VERIFY: `${API_URL}/auth/verify`,
    
    // Gallery
    GALLERY: `${API_URL}/gallery`,
    GALLERY_BY_CATEGORY: (category) => `${API_URL}/gallery/category/${category}`,
    
    // Appointments
    APPOINTMENTS: `${API_URL}/appointments`,
    APPOINTMENT_BY_ID: (id) => `${API_URL}/appointments/${id}`,
    APPOINTMENT_STATUS: (id) => `${API_URL}/appointments/${id}/status`,
};

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to set auth token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Helper function to remove auth token
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// Helper function to get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
}

console.log('✅ API configuration loaded');
