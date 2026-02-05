import React, { useState, useEffect, useRef } from 'react';
import TextEditor from './components/TextEditor';
import ChatInterface from './components/ChatInterface';
import axios from 'axios';
import './styles/App.css';

function App() {
    const [documentContent, setDocumentContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serviceStatus, setServiceStatus] = useState({ configured: false, loading: true });

    const messagesEndRef = useRef(null);

    // Initial welcome message and status check
    useEffect(() => {
        checkServiceStatus();

        // Set initial welcome message
        setMessages([
            {
                role: 'assistant',
                content: "👋 Welcome to the AI Project Proposal Assistant!\n\nI'm here to help you create a comprehensive, professional proposal for your AI project that will be submitted to the AI registry team for validation and approval.\n\nWe'll work together to document:\n✨ General information about your project\n🔧 Technical details and approach\n⚖️ Legal and compliance considerations\n📊 Data handling and security\n\nFeel free to share your idea in as much detail as you'd like - whether it's a fully formed concept or just a spark of an idea. I'll guide you through the process and ask questions to fill in any gaps.\n\n**What's your AI project idea?**",
                timestamp: new Date().toISOString()
            }
        ]);
    }, []);

    const checkServiceStatus = async () => {
        try {
            const response = await axios.get('/api/conversation/status');
            setServiceStatus({ configured: response.data.configured, loading: false });
        } catch (error) {
            console.error('Error checking service status:', error);
            setServiceStatus({ configured: false, loading: false });
        }
    };

    const handleSendMessage = async (userMessage) => {
        if (!userMessage.trim()) return;

        // Add user message to UI
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const response = await axios.post('/api/conversation/message', {
                message: userMessage,
                conversationId: conversationId
            });

            const { message, conversationId: newConvId } = response.data;

            if (newConvId) setConversationId(newConvId);

            // Extract document updates if present (using raw message)
            extractDocumentUpdates(message);

            // Cleanse the message for display:
            // 1. Remove the [UPDATE EDITOR] block and its content
            // 2. Remove any lingering empty markdown code blocks (``` ```) that might have wrapped it
            // 3. Trim whitespace
            let cleanMessage = message.replace(/\[UPDATE EDITOR\][\s\S]*?\[\/UPDATE EDITOR\]/g, '');

            // Remove empty markdown blocks that might be left over
            cleanMessage = cleanMessage.replace(/```markdown\s*```/g, '').replace(/```\s*```/g, '');

            cleanMessage = cleanMessage.trim();

            // Add CLEAN AI message to UI
            const newAiMessage = {
                role: 'assistant',
                content: cleanMessage,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, newAiMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = error.response?.data?.error || "Sorry, I encountered an error. Please check the backend connection.";
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ **Error**: ${errorMessage}`,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const extractDocumentUpdates = (content) => {
        // Search for the [UPDATE EDITOR] block defined in the new system prompt
        const updateBlockRegex = /\[UPDATE EDITOR\]([\s\S]*?)\[\/UPDATE EDITOR\]/;
        const match = content.match(updateBlockRegex);

        if (match && match[1]) {
            let newSectionContent = match[1].trim();

            // Basic Markdown to HTML conversion
            let htmlSection = newSectionContent
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                .replace(/^- (.*$)/gim, '<li>$1</li>')
                .replace(/\n/gim, '<br/>');

            // Append the new section to the existing document content
            // This enables the "progressive" building (General -> Technical -> etc.)
            // If it's the first section (General), it might look better to clear first, 
            // but appending is safer for "one section at a time" flow.
            // We adding a divider for visual separation if there is existing content
            setDocumentContent(prev => {
                const divider = prev ? '<hr class="section-divider"/>' : '';
                return prev + divider + htmlSection;
            });
        }
    };

    const handleResetConversation = async () => {
        try {
            await axios.post('/api/conversation/reset');
            setConversationId(null);
            setDocumentContent('');
            setMessages([
                {
                    role: 'assistant',
                    content: "Conversation reset. How can I help you with your new AI project proposal?",
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('Error resetting conversation:', error);
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="logo-container">
                    <span className="logo-icon">🚀</span>
                    <h1>Conversational Text Editor <span className="badge">POC</span></h1>
                </div>
                <div className="header-actions">
                    {!serviceStatus.loading && !serviceStatus.configured && (
                        <span className="status-warning">⚠️ AI Service Not Configured</span>
                    )}
                    <button className="reset-btn" onClick={handleResetConversation}>New Proposal</button>
                </div>
            </header>

            <main className="main-content">
                <div className="split-view">
                    <section className="editor-section">
                        <div className="section-header">
                            <h2>Project Proposal Document</h2>
                            <span className="info-text">Updates automatically based on conversation</span>
                        </div>
                        <TextEditor
                            content={documentContent}
                            onChange={setDocumentContent}
                        />
                    </section>

                    <section className="chat-section">
                        <div className="section-header">
                            <h2>AI Assistant</h2>
                        </div>
                        <ChatInterface
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}

export default App;
