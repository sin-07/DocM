/*
==========================================
    BACKEND SEED SCRIPT
    Seeds optional data from environment variables only.
    Usage:
        node seed.js
        SEED_ON_START=true node server.js
==========================================
*/

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function runSeed() {
    let usingInMemory = false;
    let memoryServer;

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Seeding: Connected to MongoDB (configured URI)');
    } catch (err) {
        console.warn('⚠️  Could not connect to configured MongoDB URI:', err.message);
        // If allowed or as a fallback, start an in-memory MongoDB server
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            memoryServer = await MongoMemoryServer.create();
            const uri = memoryServer.getUri();
            await mongoose.connect(uri);
            usingInMemory = true;
            console.log('✅ Seeding: Connected to in-memory MongoDB');
        } catch (memErr) {
            console.error('❌ Failed to start in-memory MongoDB:', memErr.message || memErr);
            throw memErr;
        }
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
    }

    const Admin = require('./models/Admin');
    const Appointment = require('./models/Appointment');
    const Gallery = require('./models/Gallery');

    // Admin (optional via env)
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (adminEmail && adminPasswordHash) {
            const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
            if (existing) {
                console.log('🔁 Admin already exists:', adminEmail);
            } else {
                await Admin.create({ email: adminEmail.toLowerCase(), password: adminPasswordHash });
                console.log('✅ Admin seeded:', adminEmail);
            }
        } else {
            console.log('ℹ️  ADMIN_EMAIL/ADMIN_PASSWORD_HASH not set — skipping admin seed');
        }
    } catch (err) {
        console.error('❌ Admin seed error:', err.message || err);
    }

    // Appointments (optional via env JSON)
    try {
        const appointmentsJson = process.env.APPOINTMENTS_SEED_JSON;
        const apptCount = await Appointment.countDocuments();
        if (apptCount === 0 && appointmentsJson) {
            const appts = JSON.parse(appointmentsJson);
            if (Array.isArray(appts) && appts.length) {
                await Appointment.insertMany(appts);
                console.log(`✅ Inserted ${appts.length} appointment(s)`);
            }
        } else {
            console.log('ℹ️  No appointment seed provided or collection not empty — skipping');
        }
    } catch (err) {
        console.error('❌ Appointment seed error:', err.message || err);
    }

    // Gallery (optional via env JSON)
    try {
        const galleryJson = process.env.GALLERY_SEED_JSON;
        const galleryCount = await Gallery.countDocuments();
        if (galleryCount === 0 && galleryJson) {
            const items = JSON.parse(galleryJson);
            if (Array.isArray(items) && items.length) {
                await Gallery.insertMany(items);
                console.log(`✅ Inserted ${items.length} gallery item(s)`);
            }
        } else {
            console.log('ℹ️  No gallery seed provided or collection not empty — skipping');
        }
    } catch (err) {
        console.error('❌ Gallery seed error:', err.message || err);
    }

    await mongoose.disconnect();
    if (memoryServer) {
        try { await memoryServer.stop(); } catch (e) { /* ignore */ }
    }
    console.log('🔚 Seeding complete');
}

if (require.main === module) {
    runSeed().catch(err => {
        console.error('Seeding failed:', err);
        process.exit(1);
    });
}

module.exports = runSeed;
