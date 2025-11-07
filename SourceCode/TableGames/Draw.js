/**
 * Draw - Table Game
 * A card drawing game
 */

'use strict';

class DrawGame {
    constructor() {
        this.name = 'Draw';
        this.type = 'TableGame';
        this.minPlayers = 1;
        this.maxPlayers = 4;
    }

    initialize() {
        // Game initialization logic
        console.log('Draw game initialized');
    }

    start() {
        // Start game logic
        console.log('Draw game started');
    }
}

module.exports = DrawGame;
