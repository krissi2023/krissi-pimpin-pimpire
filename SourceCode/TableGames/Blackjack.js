/**
 * Blackjack - Classic Table Game
 * The classic casino card game also known as 21
 */

'use strict';

class BlackjackGame {
    constructor() {
        this.name = 'Blackjack';
        this.type = 'TableGame';
        this.minPlayers = 1;
        this.maxPlayers = 7;
        this.dealerHand = [];
        this.playerHands = [];
    }

    initialize() {
        // Game initialization logic
        console.log('Blackjack game initialized');
    }

    start() {
        // Start game logic
        console.log('Blackjack game started');
    }

    deal() {
        // Dealing logic
        console.log('Dealing cards...');
    }

    hit() {
        // Hit logic
        console.log('Player hits');
    }

    stand() {
        // Stand logic
        console.log('Player stands');
    }
}

module.exports = BlackjackGame;
