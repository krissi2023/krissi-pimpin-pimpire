# Gemini AI Integration

This document describes the Google Gemini AI integration in the Krissi Pimpin' Pimpire gaming platform.

## Overview

The application now includes direct access to Google's Gemini AI through a simple REST API. This enables AI-powered features such as text generation, chatbots, and intelligent game interactions.

## Setup

### 1. Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure the Application

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Important**: Never commit the `.env` file to version control. It's already added to `.gitignore`.

## API Endpoints

### Check Gemini Status

**GET** `/api/gemini/status`

Check if the Gemini AI service is properly configured.

**Response:**
```json
{
  "configured": true,
  "message": "Gemini AI is ready"
}
```

### Generate Content

**POST** `/api/gemini/generate`

Generate content from a text prompt.

**Request Body:**
```json
{
  "prompt": "Tell me about casino games"
}
```

**Response:**
```json
{
  "response": "Casino games are games of chance that are commonly played in casinos..."
}
```

### Chat Interaction

**POST** `/api/gemini/chat`

Have a conversation with Gemini AI, optionally with conversation history.

**Request Body:**
```json
{
  "message": "What are the rules of blackjack?",
  "history": [
    {
      "role": "user",
      "parts": [{"text": "Hello, I want to learn about card games"}]
    },
    {
      "role": "model",
      "parts": [{"text": "I'd be happy to help you learn about card games!"}]
    }
  ]
}
```

**Response:**
```json
{
  "response": "Blackjack rules are: The goal is to get as close to 21 as possible..."
}
```

## Usage Examples

### Using curl

#### Check Status
```bash
curl http://localhost:3000/api/gemini/status
```

#### Generate Content
```bash
curl -X POST http://localhost:3000/api/gemini/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain poker hands"}'
```

#### Chat
```bash
curl -X POST http://localhost:3000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a royal flush?"}'
```

### Using JavaScript (fetch)

```javascript
// Check status
const status = await fetch('http://localhost:3000/api/gemini/status');
const statusData = await status.json();
console.log(statusData);

// Generate content
const generate = await fetch('http://localhost:3000/api/gemini/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Explain roulette' })
});
const generateData = await generate.json();
console.log(generateData.response);

// Chat
const chat = await fetch('http://localhost:3000/api/gemini/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Tell me about slot machines' })
});
const chatData = await chat.json();
console.log(chatData.response);
```

## Code Structure

- **`gemini-service.js`**: Core service module that handles all Gemini API interactions
- **`server.js`**: Express server with Gemini API endpoints
- **`.env`**: Environment configuration (not committed to git)
- **`.env.example`**: Template for environment configuration

## Service API

The `gemini-service.js` module exports a singleton instance with the following methods:

### `generateContent(prompt)`
Generate text content from a prompt.

**Parameters:**
- `prompt` (string): The text prompt

**Returns:** Promise<string> - The generated response

**Example:**
```javascript
const geminiService = require('./gemini-service');
const response = await geminiService.generateContent('Write a story about a casino');
console.log(response);
```

### `startChat(history)`
Start a new chat session with optional history.

**Parameters:**
- `history` (Array): Optional conversation history

**Returns:** Object - Chat session object

### `sendChatMessage(chat, message)`
Send a message in an existing chat session.

**Parameters:**
- `chat` (Object): The chat session object
- `message` (string): The message to send

**Returns:** Promise<string> - The response

**Example:**
```javascript
const geminiService = require('./gemini-service');
const chat = geminiService.startChat();
const response1 = await geminiService.sendChatMessage(chat, 'Hello!');
const response2 = await geminiService.sendChatMessage(chat, 'Tell me about poker');
```

### `isReady()`
Check if the service is properly configured.

**Returns:** boolean

## Security Best Practices

1. **Never commit API keys** - The `.env` file is gitignored
2. **Use environment variables** - API keys should only be in `.env` file
3. **Rate limiting** - Consider implementing rate limiting for production use
4. **Error handling** - The service includes comprehensive error handling
5. **HTTPS** - Use HTTPS in production environments

## Troubleshooting

### "Gemini API is not configured" error

**Problem:** The GEMINI_API_KEY environment variable is not set.

**Solution:**
1. Make sure you created a `.env` file (copy from `.env.example`)
2. Add your API key to the `.env` file
3. Restart the server

### API Key Invalid

**Problem:** Getting authentication errors from Gemini API.

**Solution:**
1. Verify your API key is correct
2. Check that the key has the necessary permissions
3. Generate a new key if needed at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Rate Limiting

**Problem:** Getting rate limit errors.

**Solution:**
1. Google has rate limits on API usage
2. Consider implementing caching for frequently asked questions
3. Use exponential backoff for retries
4. Upgrade your API quota if needed

## Future Enhancements

Possible future improvements:
- Add support for `gemini-pro-vision` for image analysis
- Implement caching for common queries
- Add streaming responses for long-form content
- Create dedicated gaming AI assistants
- Add conversation persistence
- Implement rate limiting and request queuing

## References

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini Node.js Quickstart](https://ai.google.dev/gemini-api/docs/quickstart?lang=node)
- [Google AI Studio](https://aistudio.google.com/)
