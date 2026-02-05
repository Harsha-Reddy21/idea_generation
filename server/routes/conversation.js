const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Store conversation history in memory (in production, use a database)
const conversations = new Map();

/**
 * POST /api/conversation/message
 * Send a message and get AI response
 */
router.post('/message', async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if AI service is configured
        if (!aiService.isConfigured()) {
            return res.status(503).json({
                error: 'AI service not configured',
                message: 'Please configure MODEL_ENDPOINT and COOKIE in the server .env file'
            });
        }

        // Get or create conversation history
        const convId = conversationId || generateConversationId();
        let history = conversations.get(convId) || [];

        // Add user message to history
        history.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Get AI response with session ID for conversation history
        // Cortex API will handle conversation history using the session ID
        const aiResponse = await aiService.chat(message, convId);

        // Add AI response to history
        history.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
        });

        // Update conversation history
        conversations.set(convId, history);

        // Send response
        res.json({
            conversationId: convId,
            message: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Conversation error:', error);
        res.status(500).json({
            error: 'Failed to process message',
            details: error.message
        });
    }
});

/**
 * POST /api/conversation/reset
 * Reset conversation history
 */
router.post('/reset', (req, res) => {
    const { conversationId } = req.body;

    if (conversationId && conversations.has(conversationId)) {
        conversations.delete(conversationId);
    }

    const newConvId = generateConversationId();
    res.json({
        conversationId: newConvId,
        message: 'Conversation reset successfully'
    });
});

/**
 * GET /api/conversation/history/:conversationId
 * Get conversation history
 */
router.get('/history/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    const history = conversations.get(conversationId) || [];

    res.json({
        conversationId,
        history
    });
});

/**
 * GET /api/conversation/status
 * Check if AI service is configured and ready
 */
router.get('/status', (req, res) => {
    const isConfigured = aiService.isConfigured();

    res.json({
        configured: isConfigured,
        message: isConfigured
            ? 'AI service is ready'
            : 'AI service not configured. Please set MODEL_ENDPOINT and COOKIE in .env file'
    });
});

/**
 * Generate a unique conversation ID
 */
function generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = router;
