/**
 * Texas Hold'em Poker - Classic Card Game
 * Complete implementation of Texas Hold'em Poker
 */

'use strict';

class TexasHoldem {
    constructor() {
        this.name = 'Texas Hold\'em Poker';
        this.type = 'CardGame';
        this.minPlayers = 2;
        this.maxPlayers = 8;
        this.deck = [];
        this.communityCards = [];
        this.players = [];
        this.pot = 0;
        this.currentBet = 0;
        this.gamePhase = 'waiting'; // waiting, preflop, flop, turn, river, showdown
    }

    initialize(playerCount = 2) {
        this.createDeck();
        this.shuffleDeck();
        this.setupPlayers(playerCount);
        console.log(`${this.name} initialized with ${playerCount} players`);
        return {
            game: this.name,
            players: this.players.length,
            gamePhase: this.gamePhase
        };
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.deck = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                this.deck.push({ suit, rank, value: this.getCardValue(rank) });
            });
        });
    }

    getCardValue(rank) {
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[rank];
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    setupPlayers(count) {
        this.players = [];
        for (let i = 0; i < count; i++) {
            this.players.push({
                id: i + 1,
                name: `Player ${i + 1}`,
                hand: [],
                chips: 1000,
                currentBet: 0,
                folded: false,
                allIn: false
            });
        }
    }

    startHand() {
        if (this.players.length < 2) {
            return { success: false, error: 'Need at least 2 players' };
        }

        // Reset hand state
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.gamePhase = 'preflop';

        // Reset players
        this.players.forEach(player => {
            player.hand = [];
            player.currentBet = 0;
            player.folded = false;
            player.allIn = false;
        });

        // Deal hole cards
        this.dealHoleCards();

        return {
            success: true,
            gamePhase: this.gamePhase,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                chips: p.chips,
                handSize: p.hand.length
            }))
        };
    }

    dealHoleCards() {
        // Deal 2 cards to each player
        for (let i = 0; i < 2; i++) {
            this.players.forEach(player => {
                if (!player.folded) {
                    player.hand.push(this.deck.pop());
                }
            });
        }
    }

    dealFlop() {
        if (this.gamePhase !== 'preflop') {
            return { success: false, error: 'Invalid game phase for flop' };
        }

        // Burn one card
        this.deck.pop();
        
        // Deal 3 community cards
        for (let i = 0; i < 3; i++) {
            this.communityCards.push(this.deck.pop());
        }

        this.gamePhase = 'flop';
        return {
            success: true,
            gamePhase: this.gamePhase,
            communityCards: this.communityCards
        };
    }

    dealTurn() {
        if (this.gamePhase !== 'flop') {
            return { success: false, error: 'Invalid game phase for turn' };
        }

        // Burn one card
        this.deck.pop();
        
        // Deal 1 community card
        this.communityCards.push(this.deck.pop());

        this.gamePhase = 'turn';
        return {
            success: true,
            gamePhase: this.gamePhase,
            communityCards: this.communityCards
        };
    }

    dealRiver() {
        if (this.gamePhase !== 'turn') {
            return { success: false, error: 'Invalid game phase for river' };
        }

        // Burn one card
        this.deck.pop();
        
        // Deal 1 community card
        this.communityCards.push(this.deck.pop());

        this.gamePhase = 'river';
        return {
            success: true,
            gamePhase: this.gamePhase,
            communityCards: this.communityCards
        };
    }

    playerAction(playerId, action, amount = 0) {
        const player = this.players.find(p => p.id === playerId);
        if (!player || player.folded) {
            return { success: false, error: 'Invalid player or player has folded' };
        }

        switch (action) {
            case 'fold':
                player.folded = true;
                break;
            case 'call': {
                const callAmount = this.currentBet - player.currentBet;
                if (callAmount > player.chips) {
                    player.allIn = true;
                    this.pot += player.chips;
                    player.currentBet += player.chips;
                    player.chips = 0;
                } else {
                    player.chips -= callAmount;
                    player.currentBet += callAmount;
                    this.pot += callAmount;
                }
                break;
            }
            case 'raise': {
                const raiseAmount = amount - player.currentBet;
                if (raiseAmount > player.chips) {
                    return { success: false, error: 'Insufficient chips' };
                }
                player.chips -= raiseAmount;
                player.currentBet = amount;
                this.pot += raiseAmount;
                this.currentBet = amount;
                break;
            }
            case 'check':
                if (player.currentBet < this.currentBet) {
                    return { success: false, error: 'Cannot check, must call or fold' };
                }
                break;
            default:
                return { success: false, error: 'Invalid action' };
        }

        return {
            success: true,
            action,
            player: {
                id: player.id,
                chips: player.chips,
                currentBet: player.currentBet,
                folded: player.folded,
                allIn: player.allIn
            },
            pot: this.pot
        };
    }

    getGameState() {
        return {
            gamePhase: this.gamePhase,
            communityCards: this.communityCards,
            pot: this.pot,
            currentBet: this.currentBet,
            activePlayers: this.players.filter(p => !p.folded).length,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                chips: p.chips,
                currentBet: p.currentBet,
                folded: p.folded,
                allIn: p.allIn,
                hasCards: p.hand.length > 0
            }))
        };
    }
}

module.exports = TexasHoldem;