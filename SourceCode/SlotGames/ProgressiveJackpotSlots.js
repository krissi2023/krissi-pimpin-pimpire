/**
 * Progressive Jackpot Slots - Network-style progressive jackpot system
 * Features multiple jackpot levels and accumulating prize pools
 */

'use strict';

class ProgressiveJackpotSlots {
    constructor() {
        this.name = 'Mega Millions Progressive';
        this.type = 'ProgressiveJackpotSlotGame';
        this.reels = 5;
        this.rows = 4; // Bigger grid for more excitement
        this.paylines = 50;
        this.symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣', '🎰', 'WILD', 'BONUS', 'JACKPOT'];
        this.specialSymbols = {
            wild: 'WILD',
            bonus: 'BONUS',
            jackpot: 'JACKPOT'
        };
        this.currentBet = 2.50; // Higher minimum bet for progressive
        this.betPerLine = 0.05;
        this.balance = 1000;
        this.lastSpin = null;
        
        // Progressive jackpot pools
        this.jackpots = {
            mini: 100,
            minor: 1000,
            major: 10000,
            grand: 100000,
            mega: 1000000
        };
        
        // Jackpot contribution rates (percentage of each bet)
        this.jackpotContributions = {
            mini: 0.01,
            minor: 0.02,
            major: 0.03,
            grand: 0.04,
            mega: 0.05
        };

        this.bonusFeatures = {
            freeSpins: 0,
            multiplier: 1,
            bonusRound: false,
            jackpotPicks: 0
        };
        
        this.payouts = this.initializePayouts();
        this.jackpotHistory = [];
    }

    initializePayouts() {
        return {
            '🍒': { 3: 3, 4: 15, 5: 50 },
            '🍋': { 3: 3, 4: 15, 5: 50 },
            '🍊': { 3: 5, 4: 25, 5: 100 },
            '🍇': { 3: 5, 4: 25, 5: 100 },
            '🔔': { 3: 10, 4: 50, 5: 250 },
            '⭐': { 3: 25, 4: 100, 5: 500 },
            '💎': { 3: 50, 4: 250, 5: 1000 },
            '7️⃣': { 3: 100, 4: 500, 5: 2500 },
            '🎰': { 3: 200, 4: 1000, 5: 5000 },
            'WILD': { 2: 10, 3: 100, 4: 1000, 5: 10000 },
            'BONUS': { 3: 'JACKPOT_BONUS', 4: 'JACKPOT_BONUS_ENHANCED', 5: 'MEGA_JACKPOT_BONUS' },
            'JACKPOT': { 5: 'MEGA_JACKPOT' }
        };
    }

    initialize() {
        console.log(`${this.name} initialized with progressive jackpots!`);
        return {
            game: this.name,
            reels: this.reels,
            rows: this.rows,
            paylines: this.paylines,
            balance: this.balance,
            currentJackpots: { ...this.jackpots },
            specialFeatures: ['Progressive Jackpots', 'Wild Multipliers', 'Jackpot Bonus Game', 'Free Spins'],
            minimumBet: 2.50
        };
    }

    setBet(totalBet) {
        if (totalBet >= 2.50 && totalBet <= this.balance) {
            this.currentBet = totalBet;
            this.betPerLine = totalBet / this.paylines;
            return { success: true, bet: this.currentBet, betPerLine: this.betPerLine };
        }
        return { success: false, error: 'Minimum bet is $2.50 for progressive jackpots' };
    }

    spin() {
        if (this.currentBet > this.balance && this.bonusFeatures.freeSpins === 0) {
            return { success: false, error: 'Insufficient balance' };
        }

        // Deduct bet and contribute to jackpots (unless free spins)
        if (this.bonusFeatures.freeSpins === 0) {
            this.balance -= this.currentBet;
            this.contributeToJackpots();
        } else {
            this.bonusFeatures.freeSpins--;
        }

        // Generate 5x4 reel grid
        const reelGrid = this.generateReelGrid();

        // Check for wins
        const wins = this.checkAllWins(reelGrid);
        const bonusCount = this.countBonusSymbols(reelGrid);
        const jackpotCount = this.countJackpotSymbols(reelGrid);
        
        // Apply multiplier
        let totalWin = wins.reduce((sum, win) => sum + win.payout, 0);
        totalWin *= this.bonusFeatures.multiplier;

        // Check for jackpot triggers
        const jackpotResults = this.checkJackpotTriggers(reelGrid, jackpotCount);
        
        // Check for bonus features
        const bonusResults = this.checkBonusFeatures(reelGrid, bonusCount);

        // Random jackpot chance (mystery jackpot)
        const mysteryJackpot = this.checkMysteryJackpot();
        if (mysteryJackpot) {
            jackpotResults.push(mysteryJackpot);
        }

        // Add winnings to balance
        const totalJackpotWin = jackpotResults.reduce((sum, result) => sum + (result.amount || 0), 0);
        this.balance += totalWin + totalJackpotWin;

        this.lastSpin = {
            reelGrid,
            wins,
            totalWin,
            jackpotResults,
            bonusResults,
            freeSpinsRemaining: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            currentJackpots: { ...this.jackpots },
            newBalance: this.balance
        };

        return {
            success: true,
            reelGrid,
            wins,
            totalWin,
            jackpotResults,
            bonusResults,
            freeSpinsRemaining: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            currentJackpots: { ...this.jackpots },
            balance: this.balance,
            bet: this.currentBet
        };
    }

    generateReelGrid() {
        const grid = [];
        for (let reel = 0; reel < this.reels; reel++) {
            const reelSymbols = [];
            for (let row = 0; row < this.rows; row++) {
                let symbol;
                const rand = Math.random();
                
                // Weighted symbol selection (progressive symbols are very rare)
                if (rand < 0.001) {
                    symbol = 'JACKPOT'; // Ultra rare
                } else if (rand < 0.01) {
                    symbol = 'BONUS';
                } else if (rand < 0.04) {
                    symbol = 'WILD';
                } else {
                    const regularSymbols = this.symbols.filter(s => !['WILD', 'BONUS', 'JACKPOT'].includes(s));
                    symbol = regularSymbols[Math.floor(Math.random() * regularSymbols.length)];
                }
                reelSymbols.push(symbol);
            }
            grid.push(reelSymbols);
        }
        return grid;
    }

    contributeToJackpots() {
        // Each bet contributes to all jackpot levels
        Object.keys(this.jackpotContributions).forEach(level => {
            const contribution = this.currentBet * this.jackpotContributions[level];
            this.jackpots[level] += contribution;
        });
    }

    checkJackpotTriggers(reelGrid, jackpotSymbolCount) {
        const results = [];

        // 5 JACKPOT symbols = MEGA JACKPOT
        if (jackpotSymbolCount >= 5) {
            const jackpotWon = this.triggerJackpot('mega');
            results.push(jackpotWon);
        }
        // 4 JACKPOT symbols = GRAND JACKPOT
        else if (jackpotSymbolCount === 4) {
            const jackpotWon = this.triggerJackpot('grand');
            results.push(jackpotWon);
        }
        // 3 JACKPOT symbols = MAJOR JACKPOT
        else if (jackpotSymbolCount === 3) {
            const jackpotWon = this.triggerJackpot('major');
            results.push(jackpotWon);
        }

        return results;
    }

    triggerJackpot(level) {
        const amount = this.jackpots[level];
        const jackpotWin = {
            type: 'JACKPOT',
            level: level.toUpperCase(),
            amount: amount,
            timestamp: new Date().toISOString()
        };

        // Add to history
        this.jackpotHistory.push(jackpotWin);

        // Reset the jackpot to its seed amount
        const seedAmounts = {
            mini: 100,
            minor: 1000,
            major: 10000,
            grand: 100000,
            mega: 1000000
        };
        this.jackpots[level] = seedAmounts[level];

        console.log(`🎰 JACKPOT WON! ${level.toUpperCase()}: $${amount.toLocaleString()}`);

        return jackpotWin;
    }

    checkMysteryJackpot() {
        // Very rare random jackpot trigger (0.01% chance)
        if (Math.random() < 0.0001) {
            // Mystery jackpots are usually mini or minor
            const mysteryLevel = Math.random() < 0.8 ? 'mini' : 'minor';
            return this.triggerJackpot(mysteryLevel);
        }
        return null;
    }

    countBonusSymbols(reelGrid) {
        let count = 0;
        for (let reel = 0; reel < reelGrid.length; reel++) {
            for (let row = 0; row < reelGrid[reel].length; row++) {
                if (reelGrid[reel][row] === 'BONUS') {
                    count++;
                }
            }
        }
        return count;
    }

    countJackpotSymbols(reelGrid) {
        let count = 0;
        for (let reel = 0; reel < reelGrid.length; reel++) {
            for (let row = 0; row < reelGrid[reel].length; row++) {
                if (reelGrid[reel][row] === 'JACKPOT') {
                    count++;
                }
            }
        }
        return count;
    }

    checkBonusFeatures(reelGrid, bonusCount) {
        const bonusResults = [];

        // Jackpot bonus game
        if (bonusCount >= 3) {
            const jackpotBonusResult = this.triggerJackpotBonusGame(bonusCount);
            bonusResults.push(jackpotBonusResult);
        }

        return bonusResults;
    }

    triggerJackpotBonusGame(bonusSymbols) {
        this.bonusFeatures.jackpotPicks = bonusSymbols;
        
        // Pick-a-box style bonus game for jackpots
        const picks = [];
        const jackpotLevels = ['mini', 'mini', 'minor', 'minor', 'major', 'grand'];
        
        for (let i = 0; i < bonusSymbols; i++) {
            const pick = Math.floor(Math.random() * jackpotLevels.length);
            const level = jackpotLevels[pick];
            
            // 10% chance to actually win the picked jackpot
            if (Math.random() < 0.1) {
                picks.push(this.triggerJackpot(level));
            } else {
                // Otherwise, credit bonus
                const bonusAmount = this.currentBet * (Math.random() * 50 + 25); // 25x-75x bet
                picks.push({
                    type: 'BONUS_CREDIT',
                    amount: bonusAmount,
                    level: level.toUpperCase()
                });
                this.balance += bonusAmount;
            }
        }

        return {
            type: 'JACKPOT_BONUS_GAME',
            picks: picks,
            totalPicks: bonusSymbols
        };
    }

    checkAllWins(reelGrid) {
        const wins = [];

        // Check each payline (similar to VideoSlots but with more paylines)
        for (let line = 0; line < this.paylines; line++) {
            const lineWin = this.checkPaylineWin(reelGrid, line);
            if (lineWin) {
                wins.push(lineWin);
            }
        }

        return wins;
    }

    checkPaylineWin(reelGrid, paylineIndex) {
        // Enhanced payline patterns for 5x4 grid
        const paylinePatterns = this.getPaylinePatterns();
        const pattern = paylinePatterns[paylineIndex % paylinePatterns.length];
        
        const lineSymbols = pattern.map((pos, reelIndex) => reelGrid[reelIndex][pos]);
        
        let matchCount = 1;
        let symbol = lineSymbols[0];
        
        // Wild symbols substitute and may add multipliers
        for (let i = 1; i < lineSymbols.length; i++) {
            if (lineSymbols[i] === symbol || lineSymbols[i] === 'WILD' || symbol === 'WILD') {
                if (symbol === 'WILD' && lineSymbols[i] !== 'WILD') {
                    symbol = lineSymbols[i];
                }
                matchCount++;
            } else {
                break;
            }
        }

        // Check for winning combination
        if (matchCount >= 2 && this.payouts[symbol] && this.payouts[symbol][matchCount]) {
            let basePayout = this.payouts[symbol][matchCount];
            
            // Wild multiplier bonus
            const wildCount = lineSymbols.slice(0, matchCount).filter(s => s === 'WILD').length;
            const wildMultiplier = wildCount > 0 ? Math.pow(2, wildCount) : 1; // 2x per wild
            
            const payout = basePayout * this.betPerLine * wildMultiplier;
            
            return {
                payline: paylineIndex + 1,
                symbol,
                matchCount,
                payout,
                wildMultiplier,
                positions: pattern.slice(0, matchCount)
            };
        }

        return null;
    }

    getPaylinePatterns() {
        // Enhanced payline patterns for 5x4 grid (50 paylines)
        const patterns = [];
        
        // Horizontal lines
        for (let row = 0; row < 4; row++) {
            patterns.push([row, row, row, row, row]);
        }
        
        // Diagonal and zigzag patterns
        patterns.push([0, 1, 2, 3, 2]); // Rising then falling
        patterns.push([3, 2, 1, 0, 1]); // Falling then rising
        patterns.push([1, 0, 1, 2, 1]); // V pattern
        patterns.push([2, 3, 2, 1, 2]); // ^ pattern
        
        // More complex patterns...
        for (let i = patterns.length; i < 50; i++) {
            // Generate additional random valid patterns
            const pattern = [];
            for (let reel = 0; reel < 5; reel++) {
                pattern.push(Math.floor(Math.random() * 4));
            }
            patterns.push(pattern);
        }
        
        return patterns;
    }

    getJackpotInfo() {
        return {
            currentJackpots: { ...this.jackpots },
            contributionRates: { ...this.jackpotContributions },
            recentWinners: this.jackpotHistory.slice(-10),
            totalJackpotsWon: this.jackpotHistory.length,
            biggestJackpot: this.jackpotHistory.reduce((max, win) => 
                win.amount > max ? win.amount : max, 0)
        };
    }

    getGameState() {
        return {
            balance: this.balance,
            currentBet: this.currentBet,
            betPerLine: this.betPerLine,
            freeSpins: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            jackpotPicks: this.bonusFeatures.jackpotPicks,
            currentJackpots: { ...this.jackpots },
            jackpotHistory: this.jackpotHistory.slice(-5), // Last 5 wins
            lastSpin: this.lastSpin
        };
    }
}

module.exports = ProgressiveJackpotSlots;