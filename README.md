# AI Project Proposal Assistant - Conversational Text Editor POC

A modern MERN stack application featuring a split-screen interface with an AI-powered conversational agent that helps users draft professional AI project proposals.

## 🌟 Features

- **Split-Screen Interface**: Text editor on the left, conversational AI on the right
- **Intelligent Conversation Flow**: AI extracts information from any user input (detailed or brief)
- **Progressive Document Building**: Document updates in real-time as information is gathered
- **Professional Formatting**: Beautiful, modern UI with dark theme and smooth animations
- **Targeted Follow-ups**: AI asks questions only for missing or unclear sections
- **Four Key Focus Areas**:
  - ✨ General Information
  - 🔧 Technical Details
  - ⚖️ Legal & Compliance
  - 📊 Data Management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AI model endpoint with authentication

## 🚀 Installation

### 1. Clone or Navigate to the Project

```bash
cd "C:\Users\SaiSubinSV\OneDrive - CHIMERA TECHNOLOGIES PVT LTD\lilly\smart product profile\text editor poc"
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration

The backend is **already configured** with your Cortex API endpoint!

1. Navigate to the `server` directory
2. The `.env` file contains:

```env
MODEL_ENDPOINT=https://dev.cortex.lilly.com/model/ask/poc-conversational-text-editor-agent
COOKIE=your_authentication_cookie
PORT=5000
```

**Note**: If your authentication cookie expires, you'll need to update it in the `.env` file.

### Cortex API Details

- **Format**: `multipart/form-data`
- **Session Management**: Uses `model_session_id_param` for conversation history
- **Timeout**: 120 seconds for AI responses
- **Authentication**: Cookie-based (optional, depending on your setup)

### AI Model Setup

The AI model at the Cortex endpoint should be configured with the system prompt from [`SYSTEM_PROMPT.md`](file:///C:/Users/SaiSubinSV/OneDrive%20-%20CHIMERA%20TECHNOLOGIES%20PVT%20LTD/lilly/smart%20product%20profile/text%20editor%20poc/SYSTEM_PROMPT.md). This prompt defines:
- Conversation flow and tone
- Information extraction strategy
- Document structure
- Response formatting

## 🎯 Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
🚀 Server running on http://localhost:5000
📝 Text Editor POC Backend

📋 Available endpoints:
   GET  /health - Health check
   POST /api/conversation/message - Send message to AI
   POST /api/conversation/reset - Reset conversation
   GET  /api/conversation/status - Check AI service status

⚙️  Environment:
   PORT: 5000
   MODEL_ENDPOINT: ✅ Configured
   COOKIE: ✅ Configured
```

### Start the Frontend Application

In a new terminal:

```bash
cd client
npm start
```

The application will open in your browser at `http://localhost:3000`

## 🎨 Usage

1. **Initial State**: The text editor will be empty, and the chat will display a warm welcome message

2. **Start Conversing**: Share your AI project idea in the chat
   - You can provide detailed information all at once
   - Or share brief ideas and let the AI guide you

3. **Watch the Magic**: As you provide information, the AI will:
   - Extract relevant details from your messages
   - Progressively update the document in the text editor
   - Ask targeted questions for missing sections

4. **Review & Refine**: 
   - Review the generated document in the text editor
   - Make manual edits if needed
   - Continue the conversation to refine any section

5. **Complete**: Once all sections are filled, your professional AI project proposal is ready for submission!

## 📁 Project Structure

```
text editor poc/
├── server/                      # Backend (Express.js)
│   ├── services/
│   │   └── aiService.js        # AI model integration
│   ├── routes/
│   │   └── conversation.js     # API endpoints
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── .env                    # Environment configuration
│
├── client/                      # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextEditor.jsx  # Rich text editor
│   │   │   ├── ChatInterface.jsx
│   │   │   └── Message.jsx
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── TextEditor.css
│   │   │   ├── ChatInterface.css
│   │   │   └── Message.css
│   │   ├── App.js              # Main application
│   │   └── index.js
│   └── package.json
│
├── SYSTEM_PROMPT.md            # AI model prompt (copy-paste ready)
└── README.md                   # This file
```

## 🔧 API Endpoints

### Backend API

- **POST** `/api/conversation/message`
  - Send a message to the AI
  - Body: `{ message: string, conversationId?: string }`
  - Response: `{ conversationId: string, message: string, timestamp: string }`

- **POST** `/api/conversation/reset`
  - Reset the conversation
  - Body: `{ conversationId?: string }`
  - Response: `{ conversationId: string, message: string }`

- **GET** `/api/conversation/status`
  - Check AI service configuration status
  - Response: `{ configured: boolean, message: string }`

- **GET** `/health`
  - Health check endpoint
  - Response: `{ status: string, message: string, timestamp: string }`

## 🎨 Design Features

- **Modern Dark Theme**: Professional dark color scheme with vibrant gradients
- **Glassmorphism**: Subtle backdrop blur effects for depth
- **Smooth Animations**: Micro-animations for enhanced user experience
- **Responsive Layout**: Works on desktop and tablet devices
- **Custom Scrollbars**: Styled scrollbars matching the theme
- **Gradient Accents**: Beautiful gradient backgrounds for key elements

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your `COOKIE` and `MODEL_ENDPOINT` values secure
- The `.gitignore` file is configured to exclude sensitive files

## 🐛 Troubleshooting

### AI Service Not Configured Warning

If you see a warning in the header:
1. Check that `server/.env` has valid `MODEL_ENDPOINT` and `COOKIE` values
2. Restart the backend server
3. Refresh the frontend application

### Connection Errors

If the frontend can't connect to the backend:
1. Ensure the backend server is running on port 5000
2. Check that no firewall is blocking the connection
3. Verify the proxy setting in `client/package.json` points to `http://localhost:5000`

### Document Not Updating

The AI needs to format responses with markdown structure. Ensure your AI model is configured with the `SYSTEM_PROMPT.md` content.

## 📝 License

This is a POC (Proof of Concept) project.

## 🤝 Support

For issues or questions, please check:
1. Backend server logs for API errors
2. Browser console for frontend errors
3. Network tab to verify API calls are successful

---

**Built with ❤️ using the MERN stack**
