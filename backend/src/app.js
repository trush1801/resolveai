const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Import real routes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'ResolveAI Core API Gateway'
  });
});

// Mount the real authentication router pipeline
app.use('/api/auth', authRoutes);

// Stubs for upcoming days
app.use('/api/chat', (req, res) => res.status(501).json({ error: 'AI Orchestrator not ready yet.' }));
app.use('/api/tickets', (req, res) => res.status(501).json({ error: 'Ticket processor not ready yet.' }));

app.use((err, req, res, next) => {
  console.error('💥 Error Occurred:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;