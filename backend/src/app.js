const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware rules for processing data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Diagnostics Probe (Used by Docker to ensure app is alive)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'ResolveAI Core API Gateway'
  });
});

// Structural route placeholders for upcoming Days
app.use('/api/auth', (req, res) => res.status(501).json({ error: 'Auth not ready yet.' }));
app.use('/api/chat', (req, res) => res.status(501).json({ error: 'AI Orchestrator not ready yet.' }));
app.use('/api/tickets', (req, res) => res.status(501).json({ error: 'Ticket processor not ready yet.' }));

// Global Crash Catcher
app.use((err, req, res, next) => {
  console.error('💥 Error Occurred:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;