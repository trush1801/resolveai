const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { handleChatMessage, getChatHistory } = require('../controllers/chatController');

router.post('/message', protect, handleChatMessage);
router.get('/history/:id', protect, getChatHistory);

module.exports = router;
