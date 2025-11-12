/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const geminiService = require('./gemini-service');

// Import game classes
const ClassicSlots = require('./SourceCode/SlotGames/ClassicSlots');
const TexasHoldem = require('./SourceCode/CardGames/TexasHoldem');
const RockPaperScissors = require('./SourceCode/QuickGames/RockPaperScissors');
const BlackjackGame = require('./SourceCode/TableGames/Blackjack');

// Import storefront
const DigitalStorefront = require('./Storefront/DigitalStorefront');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json());

// Game instances storage
const gameInstances = new Map();

// Initialize storefront
const storefront = new DigitalStorefront();

app.get('/', (req, res) => {
	res.json({
		name: 'Krissi Pimpin\' Pimpire',
		version: '1.0.0',
		description: 'AI-Powered Gaming Platform',
		endpoints: {
			games: '/api/games',
			gemini: '/api/gemini',
			storefront: '/api/store',
			stories: '/api/stories'
		}
	});
});

// Games API
app.get('/api/games', (req, res) => {
	res.json({
		availableGames: [
			{ name: 'Classic Slots', type: 'SlotGame', endpoint: '/api/games/slots' },
			{ name: 'Texas Hold\'em', type: 'CardGame', endpoint: '/api/games/poker' },
			{ name: 'Rock Paper Scissors', type: 'QuickGame', endpoint: '/api/games/rps' },
			{ name: 'Blackjack', type: 'TableGame', endpoint: '/api/games/blackjack' }
		]
	});
});

// Slot Game endpoints
app.post('/api/games/slots/init', (req, res) => {
	try {
		const gameId = 'slots_' + Date.now();
		const game = new ClassicSlots();
		const result = game.initialize();
		gameInstances.set(gameId, game);
		res.json({ gameId, ...result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/games/slots/:gameId/spin', (req, res) => {
	try {
		const game = gameInstances.get(req.params.gameId);
		if (!game) {
			return res.status(404).json({ error: 'Game not found' });
		}
		const result = game.spin();
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Quick Game endpoints
app.post('/api/games/rps/init', (req, res) => {
	try {
		const gameId = 'rps_' + Date.now();
		const game = new RockPaperScissors();
		const result = game.initialize();
		gameInstances.set(gameId, game);
		res.json({ gameId, ...result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/games/rps/:gameId/play', (req, res) => {
	try {
		const game = gameInstances.get(req.params.gameId);
		if (!game) {
			return res.status(404).json({ error: 'Game not found' });
		}
		const { choice } = req.body;
		const result = game.play(choice);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Poker endpoints
app.post('/api/games/poker/init', (req, res) => {
	try {
		const gameId = 'poker_' + Date.now();
		const game = new TexasHoldem();
		const { players = 2 } = req.body;
		const result = game.initialize(players);
		gameInstances.set(gameId, game);
		res.json({ gameId, ...result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Blackjack endpoints
app.post('/api/games/blackjack/init', (req, res) => {
	try {
		const gameId = 'blackjack_' + Date.now();
		const game = new BlackjackGame();
		const result = game.initialize();
		gameInstances.set(gameId, game);
		res.json({ gameId, ...result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Storefront API
app.get('/api/store', (req, res) => {
	try {
		const stats = storefront.getStorefrontStats();
		const featured = storefront.getFeaturedItems();
		res.json({
			storefront: storefront.name,
			categories: storefront.categories,
			stats,
			featured
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/store/browse/:category?', (req, res) => {
	try {
		const category = req.params.category;
		const filters = req.query;
		const items = storefront.browse(category, filters);
		res.json({
			category: category || 'all',
			items,
			count: items.length
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/store/item/:itemId', (req, res) => {
	try {
		const item = storefront.getItem(req.params.itemId);
		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}
		res.json(item);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/store/account/:userId', (req, res) => {
	try {
		const { userId } = req.params;
		const { initialBalance } = req.body;
		const account = storefront.createAccount(userId, initialBalance);
		res.json(account);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/store/purchase', (req, res) => {
	try {
		const { userId, itemId, paymentMethod } = req.body;
		if (!userId || !itemId) {
			return res.status(400).json({ error: 'userId and itemId are required' });
		}
		const result = storefront.purchase(userId, itemId, paymentMethod);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/store/search', (req, res) => {
	try {
		const { q } = req.query;
		if (!q) {
			return res.status(400).json({ error: 'Search query is required' });
		}
		const results = storefront.searchItems(q);
		res.json({
			query: q,
			results,
			count: results.length
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Stories API
app.get('/api/stories', (req, res) => {
	try {
		const storyItems = storefront.browse('stories');
		res.json({
			stories: storyItems,
			series: [
				{
					name: 'Krissi\'s Pimpin\' Pimpire Chronicles',
					parts: 3,
					description: 'The epic saga of digital consciousness revolution',
					complete: true
				}
			]
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/stories/:storyId', (req, res) => {
	try {
		const storyItem = storefront.getItem(req.params.storyId);
		if (!storyItem || !storyItem.content) {
			return res.status(404).json({ error: 'Story not found' });
		}
		
		// Read the story content
		const storyPath = path.join(__dirname, 'Stories', 'Comics', storyItem.content);
		if (fs.existsSync(storyPath)) {
			const content = fs.readFileSync(storyPath, 'utf8');
			res.json({
				...storyItem,
				fullContent: content,
				wordCount: content.split(' ').length,
				readingTime: Math.ceil(content.split(' ').length / 200) // ~200 words per minute
			});
		} else {
			res.status(404).json({ error: 'Story content not found' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
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