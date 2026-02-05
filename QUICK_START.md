# 🎉 Quick Start - Your App is Ready!

## ✅ Configuration Complete

Your `.env` file is already configured with:
- ✅ **MODEL_ENDPOINT**: Cortex API endpoint
- ✅ **COOKIE**: Authentication cookie

## 🚀 Start the Application

### Terminal 1 - Start Backend Server

```bash
cd "C:\Users\SaiSubinSV\OneDrive - CHIMERA TECHNOLOGIES PVT LTD\lilly\smart product profile\text editor poc\server"
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📝 Text Editor POC Backend
⚙️  Environment:
   MODEL_ENDPOINT: ✅ Configured
   COOKIE: ✅ Configured
```

### Terminal 2 - Start Frontend App

```bash
cd "C:\Users\SaiSubinSV\OneDrive - CHIMERA TECHNOLOGIES PVT LTD\lilly\smart product profile\text editor poc\client"
npm start
```

The app will automatically open at `http://localhost:3000` 🎊

---

## 🎯 How to Use

1. **Welcome Screen**: You'll see an empty editor (left) and a warm welcome message (right)

2. **Start Chatting**: Describe your AI project idea in the chat
   - Example: *"I want to build a customer sentiment analysis tool using NLP"*

3. **Watch the Magic**: 
   - The AI extracts information from your message
   - The document updates progressively in the editor
   - AI asks follow-up questions for missing details

4. **Complete Your Proposal**: Continue the conversation until all sections are filled:
   - ✨ General Information
   - 🔧 Technical Details
   - ⚖️ Legal & Compliance
   - 📊 Data Management

5. **Done!**: Your professional AI project proposal is ready for the AI registry team!

---

## 🔧 Cortex API Integration

### API Details

**Endpoint**: `https://dev.cortex.lilly.com/model/ask/poc-conversational-text-editor-agent`

**Format**: `multipart/form-data`

**Key Features**:
- ✅ Session-based conversation history (using `model_session_id_param`)
- ✅ 120-second timeout for longer responses
- ✅ Automatic error handling and retry logic
- ✅ Cookie-based authentication

### Request Format

```javascript
POST /model/ask/poc-conversational-text-editor-agent
Content-Type: multipart/form-data

q=User's message here
model_session_id_param=unique-session-id
```

### Response Format

```json
{
  "message": "AI response text...",
  "source_metadata": [],
  "steps": [...],
  "status": []
}
```

The application automatically extracts the `message` field from the response.

---

## 📋 System Prompt

The AI model is already configured with the system prompt from [`SYSTEM_PROMPT.md`](file:///C:/Users/SaiSubinSV/OneDrive%20-%20CHIMERA%20TECHNOLOGIES%20PVT%20LTD/lilly/smart%20product%20profile/text%20editor%20poc/SYSTEM_PROMPT.md).

**Key Behaviors**:
- Warm, professional, encouraging tone
- Intelligent information extraction from any input
- Progressive document building
- Targeted follow-up questions
- Never invents information

---

## 🎨 Features

### Split-Screen Interface
- **Left**: Rich text editor with professional formatting
- **Right**: Conversational AI chat interface

### Intelligent Conversation
- Understands both detailed and brief inputs
- Extracts information across all four focus areas
- Asks questions only for missing sections
- Maintains conversation history via session ID

### Progressive Document Building
- Real-time updates as information is gathered
- Intelligent section merging
- Professional markdown formatting
- Manual editing supported

### Modern UI
- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations
- Responsive design

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check that you're in the `server` directory
- Verify `node_modules` exists (run `npm install` if not)

### Frontend Won't Connect
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify proxy setting in `client/package.json`

### AI Not Responding
- Check backend terminal for API errors
- Verify your cookie hasn't expired
- Check network connectivity to Cortex API

### Cookie Expired
If you get authentication errors:
1. Get a fresh cookie from your browser
2. Update `server/.env` with the new cookie value
3. Restart the backend server

---

## 📁 Project Files

| File | Purpose |
|------|---------|
| [`server/`](file:///C:/Users/SaiSubinSV/OneDrive%20-%20CHIMERA%20TECHNOLOGIES%20PVT%20LTD/lilly/smart%20product%20profile/text%20editor%20poc/server) | Backend Express server |
| [`client/`](file:///C:/Users/SaiSubinSV/OneDrive%20-%20CHIMERA%20TECHNOLOGIES%20PVT%20LTD/lilly/smart%20product%20profile/text%20editor%20poc/client) | Frontend React app |
| [`SYSTEM_PROMPT.md`](file:///C:/Users/SaiSubinSV/OneDrive%20-%20CHIMERA%20TECHNOLOGIES%20PVT%20LTD/lilly/smart%20product%20profile/text%20editor%20poc/SYSTEM_PROMPT.md) | AI model configuration |
| [`README.md`](file:///C:/Users/SaiSubinSV/OneDrive%20-%20CHIMERA%20TECHNOLOGIES%20PVT%20LTD/lilly/smart%20product%20profile/text%20editor%20poc/README.md) | Complete documentation |

---

## 🎊 You're All Set!

Everything is configured and ready to go. Just start both servers and begin drafting your AI project proposals!

**Happy Drafting! 🚀**
