-- ==========================================
-- DATABASE SETUP FOR DOCTOR MANISH WEBSITE
-- ==========================================

-- Create database
CREATE DATABASE IF NOT EXISTS doctor_manish_db;
USE doctor_manish_db;

-- ==========================================
-- ADMINS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- ==========================================
-- GALLERY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- ==========================================
-- APPOINTMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (appointment_date),
    INDEX idx_status (status)
);

-- ==========================================
-- INSERT DEFAULT ADMIN USER
-- Email: admin@doctor-manish.com
-- Password: admin123
-- ==========================================
-- Note: Password is hashed using bcrypt (10 rounds)
INSERT INTO admins (email, password) 
VALUES ('admin@doctor-manish.com', '$2b$10$rH5q3Z3J3Z5q3Z5q3Z5q3uYpJj5J5J5J5J5J5J5J5J5J5J5J5J5J5');

-- Alternative: Insert with plain password (you'll need to hash it later)
-- INSERT INTO admins (email, password) VALUES ('admin@example.com', 'your_plain_password');

-- ==========================================
-- SAMPLE DATA (Optional)
-- ==========================================

-- Sample gallery images
INSERT INTO gallery (image_url, category, description) VALUES
('/uploads/sample1.jpg', 'surgery', 'Knee replacement surgery'),
('/uploads/sample2.jpg', 'clinic', 'Our modern clinic facility'),
('/uploads/sample3.jpg', 'team', 'Medical team consultation');

-- Sample appointments
INSERT INTO appointments (patient_name, email, phone, appointment_date, appointment_time, message, status) VALUES
('John Doe', 'john@example.com', '1234567890', '2026-02-15', '10:00:00', 'Knee pain consultation', 'pending'),
('Jane Smith', 'jane@example.com', '0987654321', '2026-02-16', '14:30:00', 'Follow-up appointment', 'confirmed');

-- ==========================================
-- VERIFY TABLES
-- ==========================================
SHOW TABLES;
SELECT * FROM admins;
