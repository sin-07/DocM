/*
==========================================
  CREATE ADMIN USER
  Run this script to create a new admin user
  Usage: node create-admin.js
==========================================
*/

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    try {
        // Get admin credentials from user input
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query) => new Promise((resolve) => readline.question(query, resolve));

        console.log('\n=== CREATE ADMIN USER ===\n');
        
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password: ');
        
        readline.close();

        // Connect to database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('\n✅ Connected to database');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Password hashed');

        // Insert admin
        const [result] = await connection.execute(
            'INSERT INTO admins (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        console.log(`✅ Admin user created successfully!`);
        console.log(`   Email: ${email}`);
        console.log(`   ID: ${result.insertId}\n`);

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
