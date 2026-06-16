/*
==========================================
  CREATE ADMIN USER (MongoDB)
  Run this script to create a new admin user
  Usage: node create-admin.js
==========================================
*/

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
    try {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query) => new Promise((resolve) => readline.question(query, resolve));

        console.log('\n=== CREATE ADMIN USER ===\n');

        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password: ');

        readline.close();

        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('ERROR: MONGODB_URI environment variable is required.');
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log('\n✅ Connected to MongoDB');

        // Load Admin model
        const Admin = require('./models/Admin');

        // Check if admin already exists
        const existing = await Admin.findOne({ email: email.toLowerCase() });
        if (existing) {
            console.log('⚠️  Admin with this email already exists!');
            await mongoose.disconnect();
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Password hashed');

        // Create admin
        const admin = new Admin({
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const saved = await admin.save();

        console.log(`✅ Admin user created successfully!`);
        console.log(`   Email: ${email}`);
        console.log(`   ID: ${saved._id}\n`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
