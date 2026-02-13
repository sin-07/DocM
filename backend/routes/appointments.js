/*
==========================================
  APPOINTMENTS ROUTES
==========================================
*/

const express = require('express');
const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const [results] = await db.query('SELECT * FROM appointments ORDER BY appointment_date DESC, appointment_time DESC');
        res.json(results);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments', message: error.message });
    }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const [results] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Failed to fetch appointment', message: error.message });
    }
});

// Create new appointment
router.post('/', async (req, res) => {
    try {
        const { patient_name, email, phone, appointment_date, appointment_time, message } = req.body;
        
        // Validation
        if (!patient_name || !phone || !appointment_date || !appointment_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const db = req.app.locals.db;
        const [result] = await db.query(
            'INSERT INTO appointments (patient_name, email, phone, appointment_date, appointment_time, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [patient_name, email || null, phone, appointment_date, appointment_time, message || null, 'pending']
        );
        
        res.json({ 
            success: true,
            id: result.insertId,
            message: 'Appointment created successfully'
        });
        
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment', message: error.message });
    }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        const db = req.app.locals.db;
        await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
        
        res.json({ success: true, message: 'Appointment status updated' });
        
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment', message: error.message });
    }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        
        await db.query('DELETE FROM appointments WHERE id = ?', [id]);
        
        res.json({ success: true, message: 'Appointment deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Failed to delete appointment', message: error.message });
    }
});

module.exports = router;
