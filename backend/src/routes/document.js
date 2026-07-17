const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { protect } = require('../middleware/authMiddleware'); // Adjust this path to match your exact auth middleware file

// Configure multer to hold the file in memory temporarily
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-pdf', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
        }

        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ status: 'error', message: 'Only PDF files are allowed.' });
        }

        // Build the multipart form payload for FastAPI
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        console.log(`Sending '${req.file.originalname}' to FastAPI Core Engine...`);

        // Forward payload to FastAPI port 8000
        const pythonResponse = await axios.post('http://127.0.0.1:8000/agent/upload-pdf', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        return res.status(200).json({
            status: 'success',
            message: pythonResponse.data.message,
            chunks_embedded: pythonResponse.data.chunks_embedded
        });

    } catch (error) {
        console.error('💥 Backend Document Proxy Exception:', error.message);
        return res.status(500).json({
            status: 'error',
            message: error.response?.data?.detail || 'Failed to process document through AI gateway.'
        });
    }
});

module.exports = router;