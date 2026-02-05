const axios = require('axios');
const FormData = require('form-data');

class AIService {
    constructor() {
        this.endpoint = process.env.MODEL_ENDPOINT;
        this.cookie = process.env.COOKIE;

        if (!this.endpoint) {
            console.warn('⚠️  MODEL_ENDPOINT not configured in .env file');
        }
        if (!this.cookie) {
            console.warn('⚠️  COOKIE not configured in .env file');
        }
    }

    /**
     * Send a prompt to the AI model and get a response
     * @param {string} prompt - The user's message or prompt
     * @param {string} sessionId - Optional session ID for conversation history
     * @returns {Promise<string>} - The AI model's response
     */
    async chat(prompt, sessionId = null) {
        try {
            if (!this.endpoint) {
                throw new Error('AI service not configured. Please set MODEL_ENDPOINT in .env file');
            }

            // Create form data - Cortex API expects multipart/form-data
            const formData = new FormData();
            formData.append('q', prompt);

            // Add other fields from the curl example (empty strings or empty values)
            // Some APIs require these to be present
            formData.append('uploaded_file', '');
            formData.append('filter_by_file', '');
            formData.append('chunks', '');

            // Build the full URL with query parameters
            // Based on the provided documentation and curl example
            let url = `${this.endpoint}?stream=false&use_responses_api=false&no_summary=false&workflow_timeout=1800&background_job=false`;

            if (sessionId) {
                url += `&model_session_id_param=${encodeURIComponent(sessionId)}`;
            }

            // Prepare headers
            const headers = {
                ...formData.getHeaders(),
                'accept': 'application/json'
            };

            // Add Cookie header if configured
            if (this.cookie) {
                headers['Cookie'] = this.cookie;
            }

            // Log for debugging
            console.log(`Sending request to Cortex API: ${url}`);

            const response = await axios.post(
                url,
                formData,
                {
                    headers: headers,
                    timeout: 120000 // 120 second timeout
                }
            );

            // Extract the message from Cortex API response
            const aiResponse = response.data?.message;

            if (!aiResponse) {
                console.error('Unexpected response format:', response.data);
                throw new Error('No message in API response');
            }

            return aiResponse;

        } catch (error) {
            console.error('AI Service Error:', error.message);

            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', JSON.stringify(error.response.data, null, 2));

                const errorMessage = error.response.data?.detail || error.response.data?.message || error.response.statusText;
                throw new Error(`Cortex API Error: ${error.response.status} - ${errorMessage}`);
            } else if (error.request) {
                console.error('No response received from Cortex API');
                throw new Error('No response from Cortex API. Please check your MODEL_ENDPOINT and network connection.');
            } else {
                throw new Error(`AI Service Error: ${error.message}`);
            }
        }
    }

    /**
     * Check if the AI service is properly configured
     * @returns {boolean}
     */
    isConfigured() {
        return !!this.endpoint;
    }
}

module.exports = new AIService();
