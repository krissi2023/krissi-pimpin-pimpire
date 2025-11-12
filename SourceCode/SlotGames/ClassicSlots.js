/**
 * Classic Slots - Simple 3-reel slot machine
 * Traditional casino slot game with multiple paylines
 */

'use strict';

class ClassicSlots {
    constructor() {
        this.name = 'Classic Slots';
        this.type = 'SlotGame';
        this.reels = 3;
        this.symbols = ['🍒', '🍋', '🍊', '🔔', '⭐', '💎', '7️⃣'];
        this.paylines = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 4, 8], // Diagonal
            [2, 4, 6]  // Anti-diagonal
        ];
        this.currentBet = 1;
        this.balance = 1000;
        this.lastSpin = null;
    }

    initialize() {
        console.log(`${this.name} initialized with balance: ${this.balance}`);
        return {
            game: this.name,
            balance: this.balance,
            symbols: this.symbols,
            paylines: this.paylines.length
        };
    }

    setBet(amount) {
        if (amount > 0 && amount <= this.balance) {
            this.currentBet = amount;
            return { success: true, bet: this.currentBet };
        }
        return { success: false, error: 'Invalid bet amount' };
    }

    spin() {
        if (this.currentBet > this.balance) {
            return { success: false, error: 'Insufficient balance' };
        }

        // Deduct bet
        this.balance -= this.currentBet;

        // Generate random symbols for 3x3 grid
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(this.symbols[Math.floor(Math.random() * this.symbols.length)]);
        }

        // Check for wins
        const wins = this.checkWins(grid);
        const totalWin = wins.reduce((sum, win) => sum + win.payout, 0);
        
        // Add winnings to balance
        this.balance += totalWin;

        this.lastSpin = {
            grid,
            wins,
            totalWin,
            newBalance: this.balance
        };

        return {
            success: true,
            grid,
            wins,
            totalWin,
            balance: this.balance,
            bet: this.currentBet
        };
    }

    checkWins(grid) {
        const wins = [];
        
        this.paylines.forEach((line, index) => {
            const symbols = line.map(pos => grid[pos]);
            if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
                const payout = this.calculatePayout(symbols[0]);
                wins.push({
                    payline: index + 1,
                    symbols: symbols[0],
                    payout: payout * this.currentBet
                });
            }
        });

        return wins;
    }

    calculatePayout(symbol) {
        const payouts = {
            '🍒': 5,
            '🍋': 10,
            '🍊': 15,
            '🔔': 25,
            '⭐': 50,
            '💎': 100,
            '7️⃣': 200
        };
        return payouts[symbol] || 0;
    }

    getGameState() {
        return {
            balance: this.balance,
            currentBet: this.currentBet,
            lastSpin: this.lastSpin
        };
    }
}

module.exports = ClassicSlots;