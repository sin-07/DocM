// Vercel Serverless Function Entry Point
// Routes all /api/* requests to the Express backend
const app = require('../backend/server');
module.exports = app;
