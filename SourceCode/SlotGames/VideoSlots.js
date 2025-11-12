/**
 * Video Slots - Modern 5-reel video slot machine
 * Advanced slot game with bonus features, wild symbols, and scatter pays
 */

'use strict';

class VideoSlots {
    constructor() {
        this.name = 'Mega Fortune Video Slots';
        this.type = 'VideoSlotGame';
        this.reels = 5;
        this.rows = 3;
        this.paylines = 25;
        this.symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣', 'WILD', 'SCATTER'];
        this.specialSymbols = {
            wild: 'WILD',
            scatter: 'SCATTER'
        };
        this.currentBet = 1;
        this.betPerLine = 0.04; // $0.04 per line default
        this.balance = 1000;
        this.lastSpin = null;
        this.bonusFeatures = {
            freeSpins: 0,
            multiplier: 1,
            bonusRound: false
        };
        this.payouts = this.initializePayouts();
    }

    initializePayouts() {
        return {
            '🍒': { 3: 5, 4: 25, 5: 100 },
            '🍋': { 3: 5, 4: 25, 5: 100 },
            '🍊': { 3: 10, 4: 50, 5: 200 },
            '🍇': { 3: 10, 4: 50, 5: 200 },
            '🔔': { 3: 25, 4: 100, 5: 500 },
            '⭐': { 3: 50, 4: 200, 5: 1000 },
            '💎': { 3: 100, 4: 500, 5: 2500 },
            '7️⃣': { 3: 200, 4: 1000, 5: 5000 },
            'WILD': { 3: 500, 4: 2500, 5: 10000 },
            'SCATTER': { 3: 'FREE_SPINS', 4: 'FREE_SPINS_BONUS', 5: 'MEGA_BONUS' }
        };
    }

    initialize() {
        console.log(`${this.name} initialized with balance: ${this.balance}`);
        return {
            game: this.name,
            reels: this.reels,
            rows: this.rows,
            paylines: this.paylines,
            balance: this.balance,
            symbols: this.symbols,
            specialFeatures: ['Wild Symbols', 'Scatter Pays', 'Free Spins', 'Bonus Rounds']
        };
    }

    setBet(totalBet) {
        if (totalBet > 0 && totalBet <= this.balance) {
            this.currentBet = totalBet;
            this.betPerLine = totalBet / this.paylines;
            return { success: true, bet: this.currentBet, betPerLine: this.betPerLine };
        }
        return { success: false, error: 'Invalid bet amount' };
    }

    spin() {
        if (this.currentBet > this.balance && this.bonusFeatures.freeSpins === 0) {
            return { success: false, error: 'Insufficient balance' };
        }

        // Deduct bet (unless free spins)
        if (this.bonusFeatures.freeSpins === 0) {
            this.balance -= this.currentBet;
        } else {
            this.bonusFeatures.freeSpins--;
        }

        // Generate 5x3 reel grid
        const reelGrid = this.generateReelGrid();

        // Check for wins
        const wins = this.checkAllWins(reelGrid);
        const scatterCount = this.countScatterSymbols(reelGrid);
        
        // Apply multiplier if in bonus mode
        let totalWin = wins.reduce((sum, win) => sum + win.payout, 0);
        totalWin *= this.bonusFeatures.multiplier;

        // Check for bonus features
        const bonusResults = this.checkBonusFeatures(reelGrid, scatterCount);

        // Add winnings to balance
        this.balance += totalWin;

        this.lastSpin = {
            reelGrid,
            wins,
            totalWin,
            bonusResults,
            freeSpinsRemaining: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            newBalance: this.balance
        };

        return {
            success: true,
            reelGrid,
            wins,
            totalWin,
            bonusResults,
            freeSpinsRemaining: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            balance: this.balance,
            bet: this.currentBet
        };
    }

    generateReelGrid() {
        const grid = [];
        for (let reel = 0; reel < this.reels; reel++) {
            const reelSymbols = [];
            for (let row = 0; row < this.rows; row++) {
                // Weighted symbol selection (wilds and scatters are rarer)
                let symbol;
                const rand = Math.random();
                if (rand < 0.05) {
                    symbol = 'WILD';
                } else if (rand < 0.08) {
                    symbol = 'SCATTER';
                } else {
                    const regularSymbols = this.symbols.filter(s => s !== 'WILD' && s !== 'SCATTER');
                    symbol = regularSymbols[Math.floor(Math.random() * regularSymbols.length)];
                }
                reelSymbols.push(symbol);
            }
            grid.push(reelSymbols);
        }
        return grid;
    }

    checkAllWins(reelGrid) {
        const wins = [];

        // Check each payline
        for (let line = 0; line < this.paylines; line++) {
            const lineWin = this.checkPaylineWin(reelGrid, line);
            if (lineWin) {
                wins.push(lineWin);
            }
        }

        return wins;
    }

    checkPaylineWin(reelGrid, paylineIndex) {
        // Simplified payline patterns (in real game, these would be more complex)
        const paylinePatterns = this.getPaylinePatterns();
        const pattern = paylinePatterns[paylineIndex % paylinePatterns.length];
        
        const lineSymbols = pattern.map((pos, reelIndex) => reelGrid[reelIndex][pos]);
        
        // Count consecutive matching symbols from left to right
        let matchCount = 1;
        let symbol = lineSymbols[0];
        
        // Wild symbols substitute for any symbol
        for (let i = 1; i < lineSymbols.length; i++) {
            if (lineSymbols[i] === symbol || lineSymbols[i] === 'WILD' || symbol === 'WILD') {
                if (symbol === 'WILD' && lineSymbols[i] !== 'WILD') {
                    symbol = lineSymbols[i]; // Wild takes on the symbol identity
                }
                matchCount++;
            } else {
                break;
            }
        }

        // Check for winning combination
        if (matchCount >= 3 && this.payouts[symbol] && this.payouts[symbol][matchCount]) {
            const basePayout = this.payouts[symbol][matchCount];
            const payout = basePayout * this.betPerLine;
            
            return {
                payline: paylineIndex + 1,
                symbol,
                matchCount,
                payout,
                positions: pattern.slice(0, matchCount)
            };
        }

        return null;
    }

    getPaylinePatterns() {
        // Simplified payline patterns for 5x3 grid
        return [
            [1, 1, 1, 1, 1], // Middle row
            [0, 0, 0, 0, 0], // Top row
            [2, 2, 2, 2, 2], // Bottom row
            [0, 1, 2, 1, 0], // V pattern
            [2, 1, 0, 1, 2], // ^ pattern
            [0, 0, 1, 2, 2], // Ascending
            [2, 2, 1, 0, 0], // Descending
            [1, 0, 1, 2, 1], // W pattern
            [1, 2, 1, 0, 1], // M pattern
            [0, 1, 0, 1, 0], // Zigzag
            // ... more patterns for remaining paylines
        ];
    }

    countScatterSymbols(reelGrid) {
        let count = 0;
        for (let reel = 0; reel < reelGrid.length; reel++) {
            for (let row = 0; row < reelGrid[reel].length; row++) {
                if (reelGrid[reel][row] === 'SCATTER') {
                    count++;
                }
            }
        }
        return count;
    }

    checkBonusFeatures(reelGrid, scatterCount) {
        const bonusResults = [];

        // Free spins bonus
        if (scatterCount >= 3) {
            const freeSpinsAwarded = scatterCount * 5; // 5 spins per scatter
            this.bonusFeatures.freeSpins += freeSpinsAwarded;
            this.bonusFeatures.multiplier = Math.min(this.bonusFeatures.multiplier + 1, 5); // Max 5x multiplier
            
            bonusResults.push({
                type: 'FREE_SPINS',
                awarded: freeSpinsAwarded,
                scatterCount,
                multiplier: this.bonusFeatures.multiplier
            });
        }

        // Mega bonus for 5 scatters
        if (scatterCount >= 5) {
            const megaBonusWin = this.currentBet * 100;
            this.balance += megaBonusWin;
            
            bonusResults.push({
                type: 'MEGA_BONUS',
                payout: megaBonusWin
            });
        }

        return bonusResults;
    }

    triggerBonusRound() {
        this.bonusFeatures.bonusRound = true;
        this.bonusFeatures.multiplier = 3;
        
        // Bonus round with guaranteed wins
        const bonusWins = Math.floor(Math.random() * 5) + 3; // 3-7 bonus wins
        let totalBonusWin = 0;
        
        for (let i = 0; i < bonusWins; i++) {
            const bonusWin = this.currentBet * (Math.random() * 20 + 5); // 5x to 25x bet
            totalBonusWin += bonusWin;
        }
        
        this.balance += totalBonusWin;
        this.bonusFeatures.bonusRound = false;
        this.bonusFeatures.multiplier = 1;
        
        return {
            type: 'BONUS_ROUND',
            totalWin: totalBonusWin,
            bonusSpins: bonusWins
        };
    }

    getGameState() {
        return {
            balance: this.balance,
            currentBet: this.currentBet,
            betPerLine: this.betPerLine,
            freeSpins: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            bonusRound: this.bonusFeatures.bonusRound,
            lastSpin: this.lastSpin,
            gameStats: {
                totalSpins: this.totalSpins || 0,
                totalWins: this.totalWins || 0,
                biggestWin: this.biggestWin || 0
            }
        };
    }

    resetBonusFeatures() {
        this.bonusFeatures = {
            freeSpins: 0,
            multiplier: 1,
            bonusRound: false
        };
    }
}

module.exports = VideoSlots;