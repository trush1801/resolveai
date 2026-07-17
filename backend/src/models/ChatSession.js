const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  messages: {
    type: [MessageSchema],
    default: []
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ChatSessionSchema.index({ userId: 1, updatedAt: -1 });
ChatSessionSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
