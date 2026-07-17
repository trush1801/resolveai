const axios = require('axios');
const crypto = require('crypto');
const ChatSession = require('../models/ChatSession');

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || 'http://127.0.0.1:8000';
const AGENT_CHAT_PATH = process.env.AGENT_CHAT_PATH || '/agent/chat';
const AGENT_TIMEOUT_MS = Number(process.env.AGENT_TIMEOUT_MS || 120000);
const INTERNAL_FAILURE_REPLIES = new Set([
  'Internal Agent Core processing failure.',
  'Processing message via ResolveAI LangGraph multi-agent routing...'
]);

const generateSessionId = () => `session_${crypto.randomUUID()}`;

const getAuthenticatedUserId = (req) => {
  if (!req.user) return null;
  if (req.user.id) return String(req.user.id);
  if (typeof req.user.get === 'function') return String(req.user.get('id'));
  return null;
};

const normalizeMessage = (message) => ({
  _id: message._id ? String(message._id) : undefined,
  role: message.role,
  content: message.content,
  timestamp: message.timestamp
});

const normalizeHistory = (messages = []) => (
  messages
    .filter((message) => message && message.role && message.content)
    .filter((message) => !INTERNAL_FAILURE_REPLIES.has(message.content.trim()))
    .map(normalizeMessage)
);

const historyForAgent = (messages = []) => (
  messages
    .filter((message) => message && message.role && message.content)
    .filter((message) => !INTERNAL_FAILURE_REPLIES.has(message.content.trim()))
    .map((message) => ({
      role: message.role,
      content: message.content
    }))
);

const extractAgentReply = (data) => {
  if (!data) return null;

  const candidates = [
    data.response,
    data.answer,
    data.reply,
    data.message,
    data.result
  ];

  const reply = candidates.find((value) => typeof value === 'string' && value.trim());
  return reply ? reply.trim() : null;
};

const getOrCreateSession = async ({ sessionId, userId }) => {
  if (!sessionId) {
    return new ChatSession({
      sessionId: generateSessionId(),
      userId,
      messages: []
    });
  }

  const existingSession = await ChatSession.findOne({ sessionId, userId });
  if (existingSession) return existingSession;

  const sessionOwnedByAnotherUser = await ChatSession.exists({ sessionId });
  if (sessionOwnedByAnotherUser) {
    const error = new Error('Chat session does not belong to the authenticated user.');
    error.statusCode = 403;
    throw error;
  }

  return new ChatSession({
    sessionId,
    userId,
    messages: []
  });
};

const buildAgentUrl = () => {
  const baseUrl = AGENT_SERVER_URL.replace(/\/$/, '');
  const path = AGENT_CHAT_PATH.startsWith('/') ? AGENT_CHAT_PATH : `/${AGENT_CHAT_PATH}`;
  return `${baseUrl}${path}`;
};

const handleChatMessage = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    const requestedSessionId = typeof req.body.sessionId === 'string' && req.body.sessionId.trim()
      ? req.body.sessionId.trim()
      : null;

    if (!userId) {
      return res.status(401).json({ error: 'Not authorized, user not found.' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const chatSession = await getOrCreateSession({
      sessionId: requestedSessionId,
      userId
    });

    chatSession.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    const agentResponse = await axios.post(
      buildAgentUrl(),
      {
        message,
        sessionId: chatSession.sessionId,
        history: historyForAgent(chatSession.messages)
      },
      {
        timeout: AGENT_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const assistantReply = extractAgentReply(agentResponse.data);
    if (!assistantReply) {
      return res.status(502).json({
        error: 'Agent server returned an empty response.',
        agentPayload: agentResponse.data
      });
    }

    if (INTERNAL_FAILURE_REPLIES.has(assistantReply)) {
      return res.status(502).json({
        error: 'Agent server reported an internal processing failure.'
      });
    }

    chatSession.messages.push({
      role: 'assistant',
      content: assistantReply,
      timestamp: new Date()
    });
    chatSession.lastMessageAt = new Date();

    await chatSession.save();

    return res.status(200).json({
      status: 'success',
      sessionId: chatSession.sessionId,
      reply: assistantReply,
      history: normalizeHistory(chatSession.messages)
    });
  } catch (error) {
    const statusCode = error.statusCode || error.response?.status || 500;
    const agentError = error.response?.data?.detail || error.response?.data?.error || error.response?.data;

    console.error('Chat pipeline gateway error:', {
      message: error.message,
      statusCode,
      agentError
    });

    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      error: 'Failed to process message through the ResolveAI agent server.',
      details: agentError || error.message
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const sessionId = typeof req.params.id === 'string' ? req.params.id.trim() : '';

    if (!userId) {
      return res.status(401).json({ error: 'Not authorized, user not found.' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    const chatSession = await ChatSession.findOne({ sessionId, userId });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session history not found.' });
    }

    return res.status(200).json({
      status: 'success',
      sessionId: chatSession.sessionId,
      history: normalizeHistory(chatSession.messages)
    });
  } catch (error) {
    console.error('Chat history lookup error:', error.message);
    return res.status(500).json({
      error: 'Failed to load chat history.',
      details: error.message
    });
  }
};

module.exports = {
  handleChatMessage,
  getChatHistory
};
