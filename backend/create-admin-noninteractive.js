/*
==========================================
  CREATE ADMIN USER (Non-interactive)
  Usage (PowerShell):
    $env:ADMIN_EMAIL='you@example.com'; $env:ADMIN_PASSWORD='s3cret'; node backend/create-admin-noninteractive.js
==========================================
*/

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdminNonInteractive() {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
            process.exit(1);
        }

        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('ERROR: MONGODB_URI environment variable is required.');
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Admin = require('./models/Admin');

        const existing = await Admin.findOne({ email: email.toLowerCase() });
        if (existing) {
            console.log('⚠️  Admin with this email already exists!');
            await mongoose.disconnect();
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const saved = await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${email}`);
        console.log(`   ID: ${saved._id}`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err.message || err);
        process.exit(1);
    }
}

createAdminNonInteractive();
