/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');
const geminiService = require('./gemini-service');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello remote world!\n');
});

// Gemini AI endpoints
app.get('/api/gemini/status', (req, res) => {
	res.json({
		configured: geminiService.isReady(),
		message: geminiService.isReady() 
			? 'Gemini AI is ready' 
			: 'Gemini AI is not configured. Please set GEMINI_API_KEY in your .env file'
	});
});

app.post('/api/gemini/generate', async (req, res) => {
	try {
		const { prompt } = req.body;
		
		if (!prompt) {
			return res.status(400).json({ error: 'Prompt is required' });
		}

		const response = await geminiService.generateContent(prompt);
		res.json({ response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/gemini/chat', async (req, res) => {
	try {
		const { message, history } = req.body;
		
		if (!message) {
			return res.status(400).json({ error: 'Message is required' });
		}

		const chat = geminiService.startChat(history || []);
		const response = await geminiService.sendChatMessage(chat, message);
		res.json({ response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log(`Gemini AI Status: ${geminiService.isReady() ? 'Ready' : 'Not Configured'}`);