/*
==========================================
  BACKEND SEED SCRIPT
  - Reads `admin-seed.json`, `appointments-seed.json`, `gallery-seed.json`
  - Inserts sample data if collections are empty or admin missing
  Usage:
    node seed.js
    SEED_ON_START=true node server.js
==========================================
*/

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aniketsingh9322_db_user:VUFHymiDJAq45jOf@cluster0.2cnpaeo.mongodb.net/doctor_manish_db?appName=Cluster0';

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

    const Admin = require('./models/Admin');
    const Appointment = require('./models/Appointment');
    const Gallery = require('./models/Gallery');

    // Admin
    try {
        const adminSeedPath = path.join(__dirname, 'admin-seed.json');
        if (fs.existsSync(adminSeedPath)) {
            const adminSeed = JSON.parse(fs.readFileSync(adminSeedPath, 'utf8'));
            const existing = await Admin.findOne({ email: adminSeed.email.toLowerCase() });
            if (existing) {
                console.log('🔁 Admin already exists:', adminSeed.email);
            } else {
                await Admin.create({ email: adminSeed.email.toLowerCase(), password: adminSeed.passwordHash });
                console.log('✅ Admin seeded:', adminSeed.email);
            }
        } else {
            console.log('⚠️  admin-seed.json not found — skipping admin seed');
        }
    } catch (err) {
        console.error('❌ Admin seed error:', err.message || err);
    }

    // Appointments
    try {
        const apptCount = await Appointment.countDocuments();
        if (apptCount === 0) {
            const apptPath = path.join(__dirname, 'appointments-seed.json');
            if (fs.existsSync(apptPath)) {
                const appts = JSON.parse(fs.readFileSync(apptPath, 'utf8'));
                if (Array.isArray(appts) && appts.length) {
                    await Appointment.insertMany(appts);
                    console.log(`✅ Inserted ${appts.length} appointment(s)`);
                }
            } else {
                console.log('⚠️  appointments-seed.json not found — skipping appointment seed');
            }
        } else {
            console.log('🔁 Appointments collection not empty — skipping');
        }
    } catch (err) {
        console.error('❌ Appointment seed error:', err.message || err);
    }

    // Gallery
    try {
        const galleryCount = await Gallery.countDocuments();
        if (galleryCount === 0) {
            const galleryPath = path.join(__dirname, 'gallery-seed.json');
            if (fs.existsSync(galleryPath)) {
                const items = JSON.parse(fs.readFileSync(galleryPath, 'utf8'));
                if (Array.isArray(items) && items.length) {
                    await Gallery.insertMany(items);
                    console.log(`✅ Inserted ${items.length} gallery item(s)`);
                }
            } else {
                console.log('⚠️  gallery-seed.json not found — skipping gallery seed');
            }
        } else {
            console.log('🔁 Gallery collection not empty — skipping');
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
