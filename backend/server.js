/*
==========================================
  DOCTOR MANISH BACKEND SERVER
  Express + MongoDB (Mongoose)
==========================================
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dns = require('dns');
const fs = require('fs');
// Load environment variables: prefer backend/.env, otherwise fall back to repository root .env
const backendEnv = path.join(__dirname, '.env');
const rootEnv = path.join(__dirname, '..', '.env');
if (fs.existsSync(backendEnv)) {
    require('dotenv').config({ path: backendEnv });
} else if (fs.existsSync(rootEnv)) {
    require('dotenv').config({ path: rootEnv });
} else {
    require('dotenv').config();
}

// Force Node.js to use Google DNS (fixes SRV lookup issues on some networks)
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5501',
        'http://127.0.0.1:5501',
        'https://doc-m.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with in-memory fallback
const MONGODB_URI = process.env.MONGODB_URI;

let memoryServerInstance = null;
async function connectWithFallback() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not set');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI, { connectTimeoutMS: 10000 });
        console.log('✅ Connected to MongoDB (configured URI)');
    } catch (err) {
        console.warn('⚠️  MongoDB connection failed:', err.message);
        console.log('➡️  Falling back to in-memory MongoDB for local development');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            memoryServerInstance = await MongoMemoryServer.create();
            const uri = memoryServerInstance.getUri();
            await mongoose.connect(uri);
            console.log('✅ Connected to in-memory MongoDB');
        } catch (memErr) {
            console.error('❌ Failed to start in-memory MongoDB:', memErr.message || memErr);
            process.exit(1);
        }
    }

    // Optional seeding on startup when SEED_ON_START=true
    if (process.env.SEED_ON_START === 'true' || process.env.SEED_ON_START === '1') {
        try {
            const seed = require('./seed');
            await seed();
        } catch (err) {
            console.error('Seeding failed:', err.message || err);
        }
    }

    // Start server only after DB is connected (prevents MongoNotConnectedError)
    if (require.main === module) {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
            console.log(`🌐 CORS enabled for local dev servers`);
        });
    }
}

connectWithFallback();

// Ensure memory server is stopped on exit
process.on('exit', async () => {
    if (memoryServerInstance) {
        try { await memoryServerInstance.stop(); } catch (e) { /* ignore */ }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/appointments', require('./routes/appointments'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel serverless
module.exports = app;
