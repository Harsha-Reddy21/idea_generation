require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const conversationRoutes = require('./routes/conversation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/conversation', conversationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Text Editor POC Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from React build (for production/Docker)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
        // Don't serve React app for API routes
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API endpoint not found' });
        }
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
} else {
    // Root endpoint (for development)
    app.get('/', (req, res) => {
        res.json({
            message: 'Conversational Text Editor POC - Backend Server',
            endpoints: {
                health: '/health',
                conversation: '/api/conversation/*'
            }
        });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Text Editor POC Backend`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   POST /api/conversation/message - Send message to AI`);
    console.log(`   POST /api/conversation/reset - Reset conversation`);
    console.log(`   GET  /api/conversation/status - Check AI service status`);
    console.log(`\n⚙️  Environment:`);
    console.log(`   PORT: ${PORT}`);
    console.log(`   MODEL_ENDPOINT: ${process.env.MODEL_ENDPOINT ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`   COOKIE: ${process.env.COOKIE ? '✅ Configured' : '❌ Not configured'}`);
    console.log('\n');
});
