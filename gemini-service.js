/*---------------------------------------------------------------------------------------------
 *  Gemini AI Service
 *  Provides direct access to Google's Gemini AI API
 *--------------------------------------------------------------------------------------------*/

'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
	constructor() {
		const apiKey = process.env.GEMINI_API_KEY;
		
		if (!apiKey) {
			console.warn('Warning: GEMINI_API_KEY not found in environment variables');
			this.isConfigured = false;
			return;
		}
		
		this.googleAI = new GoogleGenerativeAI(apiKey);
		this.model = this.googleAI.getGenerativeModel({ model: 'gemini-pro' });
		this.isConfigured = true;
	}

	/**
	 * Generate content from a text prompt
	 * @param {string} prompt - The text prompt to send to Gemini
	 * @returns {Promise<string>} - The generated response
	 */
	async generateContent(prompt) {
		if (!this.isConfigured) {
			throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file');
		}

		try {
			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			return response.text();
		} catch (error) {
			console.error('Gemini API Error:', error);
			throw new Error(`Failed to generate content: ${error.message}`);
		}
	}

	/**
	 * Start a chat session with conversation history
	 * @param {Array} history - Optional conversation history
	 * @returns {Object} - Chat session object
	 */
	startChat(history = []) {
		if (!this.isConfigured) {
			throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file');
		}

		return this.model.startChat({
			history: history,
			generationConfig: {
				maxOutputTokens: 1000,
			},
		});
	}

	/**
	 * Send a message in a chat session
	 * @param {Object} chat - The chat session object
	 * @param {string} message - The message to send
	 * @returns {Promise<string>} - The response from Gemini
	 */
	async sendChatMessage(chat, message) {
		try {
			const result = await chat.sendMessage(message);
			const response = await result.response;
			return response.text();
		} catch (error) {
			console.error('Gemini Chat Error:', error);
			throw new Error(`Failed to send chat message: ${error.message}`);
		}
	}

	/**
	 * Check if the service is properly configured
	 * @returns {boolean} - True if configured, false otherwise
	 */
	isReady() {
		return this.isConfigured;
	}
}

module.exports = new GeminiService();
