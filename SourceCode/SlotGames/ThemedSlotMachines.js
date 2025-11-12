/**
 * Themed Slot Machines - Multiple themed slot games with unique mechanics
 * Features different themes like Egyptian, Ocean, Space, and Fantasy
 */

'use strict';

class ThemedSlotMachines {
    constructor(theme = 'egyptian') {
        this.availableThemes = ['egyptian', 'ocean', 'space', 'fantasy', 'western', 'neon'];
        this.currentTheme = this.availableThemes.includes(theme) ? theme : 'egyptian';
        
        // Initialize theme-specific properties
        this.initializeTheme();
        
        this.reels = 5;
        this.rows = 3;
        this.paylines = 20;
        this.currentBet = 1;
        this.betPerLine = 0.05;
        this.balance = 1000;
        this.lastSpin = null;
        
        this.bonusFeatures = {
            freeSpins: 0,
            multiplier: 1,
            bonusRound: false,
            themeBonus: false
        };
        
        this.payouts = this.initializeThemePayouts();
        this.achievements = [];
    }

    initializeTheme() {
        const themeConfigs = {
            egyptian: {
                name: 'Treasures of the Pharaoh',
                symbols: ['🐪', '🏺', '🔱', '👑', '💍', '🪙', '⚱️', '📿', 'ANUBIS', 'PHARAOH'],
                specialSymbols: { wild: 'PHARAOH', scatter: 'ANUBIS', bonus: '⚱️' },
                themeFeatures: ['Pyramid Bonus', 'Mummy Wild', 'Treasure Hunt'],
                soundscape: 'mystical_egyptian',
                backgroundColor: '#D4AF37'
            },
            ocean: {
                name: 'Deep Sea Adventures',
                symbols: ['🐟', '🐙', '🦈', '🐚', '⚓', '🚢', '💰', '🔱', 'POSEIDON', 'KRAKEN'],
                specialSymbols: { wild: 'POSEIDON', scatter: 'KRAKEN', bonus: '💰' },
                themeFeatures: ['Whirlpool Bonus', 'Tidal Wilds', 'Sunken Treasure'],
                soundscape: 'ocean_waves',
                backgroundColor: '#006994'
            },
            space: {
                name: 'Galactic Fortune',
                symbols: ['🚀', '👽', '🛸', '🌟', '💎', '⚡', '🌌', '🪐', 'ALIEN', 'MOTHERSHIP'],
                specialSymbols: { wild: 'MOTHERSHIP', scatter: 'ALIEN', bonus: '🛸' },
                themeFeatures: ['Abduction Bonus', 'Cosmic Wilds', 'Planet Jackpot'],
                soundscape: 'space_ambient',
                backgroundColor: '#1a1a2e'
            },
            fantasy: {
                name: 'Magical Realms',
                symbols: ['🐉', '🧙‍♂️', '⚔️', '🏰', '💎', '🧪', '📖', '🔮', 'WIZARD', 'DRAGON'],
                specialSymbols: { wild: 'WIZARD', scatter: 'DRAGON', bonus: '🔮' },
                themeFeatures: ['Spell Bonus', 'Magic Wilds', 'Dragon Horde'],
                soundscape: 'mystical_fantasy',
                backgroundColor: '#4B0082'
            },
            western: {
                name: 'Wild West Gold',
                symbols: ['🤠', '🐎', '🔫', '⭐', '💰', '🍺', '🎰', '🏜️', 'SHERIFF', 'OUTLAW'],
                specialSymbols: { wild: 'SHERIFF', scatter: 'OUTLAW', bonus: '💰' },
                themeFeatures: ['Duel Bonus', 'Bandit Wilds', 'Gold Rush'],
                soundscape: 'western_saloon',
                backgroundColor: '#8B4513'
            },
            neon: {
                name: 'Neon City Nights',
                symbols: ['💿', '🎮', '📱', '💡', '🔋', '⚡', '🌃', '🎯', 'CYBER', 'NEON'],
                specialSymbols: { wild: 'NEON', scatter: 'CYBER', bonus: '⚡' },
                themeFeatures: ['Circuit Bonus', 'Electric Wilds', 'Data Stream'],
                soundscape: 'cyberpunk_beats',
                backgroundColor: '#FF00FF'
            }
        };
        
        this.themeConfig = themeConfigs[this.currentTheme];
        this.name = this.themeConfig.name;
        this.type = 'ThemedSlotGame';
        this.symbols = this.themeConfig.symbols;
        this.specialSymbols = this.themeConfig.specialSymbols;
    }

    initializeThemePayouts() {
        const basePayouts = {
            // Regular symbols (theme-specific)
            [this.symbols[0]]: { 3: 5, 4: 25, 5: 100 },
            [this.symbols[1]]: { 3: 5, 4: 25, 5: 100 },
            [this.symbols[2]]: { 3: 8, 4: 40, 5: 200 },
            [this.symbols[3]]: { 3: 8, 4: 40, 5: 200 },
            [this.symbols[4]]: { 3: 15, 4: 75, 5: 400 },
            [this.symbols[5]]: { 3: 15, 4: 75, 5: 400 },
            [this.symbols[6]]: { 3: 25, 4: 125, 5: 750 },
            [this.symbols[7]]: { 3: 25, 4: 125, 5: 750 },
            
            // Special symbols
            [this.specialSymbols.wild]: { 2: 50, 3: 250, 4: 1250, 5: 6250 },
            [this.specialSymbols.scatter]: { 3: 'FREE_SPINS', 4: 'FREE_SPINS_ENHANCED', 5: 'MEGA_FREE_SPINS' },
            [this.specialSymbols.bonus]: { 3: 'THEME_BONUS', 4: 'THEME_BONUS_ENHANCED', 5: 'THEME_MEGA_BONUS' }
        };
        
        return basePayouts;
    }

    initialize() {
        console.log(`${this.name} (${this.currentTheme} theme) initialized!`);
        return {
            game: this.name,
            theme: this.currentTheme,
            reels: this.reels,
            rows: this.rows,
            paylines: this.paylines,
            balance: this.balance,
            symbols: this.symbols,
            specialFeatures: this.themeConfig.themeFeatures,
            availableThemes: this.availableThemes,
            themeColors: this.themeConfig.backgroundColor
        };
    }

    switchTheme(newTheme) {
        if (this.availableThemes.includes(newTheme)) {
            this.currentTheme = newTheme;
            this.initializeTheme();
            this.payouts = this.initializeThemePayouts();
            this.resetBonusFeatures();
            
            return {
                success: true,
                newTheme: this.currentTheme,
                themeName: this.name,
                themeFeatures: this.themeConfig.themeFeatures
            };
        }
        return { success: false, error: 'Invalid theme' };
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

        // Generate themed reel grid
        const reelGrid = this.generateThemedReelGrid();

        // Check for wins
        const wins = this.checkAllWins(reelGrid);
        const scatterCount = this.countSpecialSymbols(reelGrid, this.specialSymbols.scatter);
        const bonusCount = this.countSpecialSymbols(reelGrid, this.specialSymbols.bonus);
        
        // Apply theme multipliers
        let totalWin = wins.reduce((sum, win) => sum + win.payout, 0);
        totalWin *= this.bonusFeatures.multiplier;

        // Apply theme-specific bonuses
        const themeBonus = this.checkThemeSpecificBonuses(reelGrid);
        if (themeBonus) {
            totalWin += themeBonus.amount;
        }

        // Check for bonus features
        const bonusResults = this.checkBonusFeatures(reelGrid, scatterCount, bonusCount);

        // Check for achievements
        const newAchievements = this.checkAchievements(reelGrid, totalWin, bonusResults);

        // Add winnings to balance
        this.balance += totalWin;

        this.lastSpin = {
            reelGrid,
            wins,
            totalWin,
            themeBonus,
            bonusResults,
            newAchievements,
            freeSpinsRemaining: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            newBalance: this.balance
        };

        return {
            success: true,
            theme: this.currentTheme,
            reelGrid,
            wins,
            totalWin,
            themeBonus,
            bonusResults,
            newAchievements,
            freeSpinsRemaining: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            balance: this.balance,
            bet: this.currentBet
        };
    }

    generateThemedReelGrid() {
        const grid = [];
        for (let reel = 0; reel < this.reels; reel++) {
            const reelSymbols = [];
            for (let row = 0; row < this.rows; row++) {
                let symbol;
                const rand = Math.random();
                
                // Theme-specific symbol weights
                if (rand < 0.03) {
                    symbol = this.specialSymbols.wild;
                } else if (rand < 0.05) {
                    symbol = this.specialSymbols.scatter;
                } else if (rand < 0.07) {
                    symbol = this.specialSymbols.bonus;
                } else {
                    // Regular themed symbols with different weights
                    const regularSymbols = this.symbols.filter(s => 
                        !Object.values(this.specialSymbols).includes(s));
                    symbol = regularSymbols[Math.floor(Math.random() * regularSymbols.length)];
                }
                reelSymbols.push(symbol);
            }
            grid.push(reelSymbols);
        }
        return grid;
    }

    checkThemeSpecificBonuses(reelGrid) {
        switch (this.currentTheme) {
            case 'egyptian':
                return this.checkPyramidBonus(reelGrid);
            case 'ocean':
                return this.checkTidalBonus(reelGrid);
            case 'space':
                return this.checkCosmicBonus(reelGrid);
            case 'fantasy':
                return this.checkMagicBonus(reelGrid);
            case 'western':
                return this.checkGoldRushBonus(reelGrid);
            case 'neon':
                return this.checkElectricBonus(reelGrid);
            default:
                return null;
        }
    }

    checkPyramidBonus(reelGrid) {
        // Egyptian theme: Pyramid formation bonus
        const pyramidPositions = [
            [2, 1], [2, 2], [2, 3], // Bottom row
            [1, 1], [1, 2], // Middle row
            [0, 2] // Top
        ];
        
        let pyramidSymbols = 0;
        pyramidPositions.forEach(([row, reel]) => {
            if (reelGrid[reel] && reelGrid[reel][row] === '👑') {
                pyramidSymbols++;
            }
        });
        
        if (pyramidSymbols >= 4) {
            const bonus = this.currentBet * pyramidSymbols * 10;
            return { type: 'PYRAMID_BONUS', amount: bonus, symbolCount: pyramidSymbols };
        }
        return null;
    }

    checkTidalBonus(reelGrid) {
        // Ocean theme: Consecutive wave bonus
        let consecutiveWaves = 0;
        let maxWaves = 0;
        
        for (let reel = 0; reel < this.reels; reel++) {
            let hasWaveSymbol = reelGrid[reel].some(symbol => ['🐙', '🦈', '🌊'].includes(symbol));
            if (hasWaveSymbol) {
                consecutiveWaves++;
                maxWaves = Math.max(maxWaves, consecutiveWaves);
            } else {
                consecutiveWaves = 0;
            }
        }
        
        if (maxWaves >= 3) {
            const bonus = this.currentBet * maxWaves * 8;
            return { type: 'TIDAL_BONUS', amount: bonus, waveLength: maxWaves };
        }
        return null;
    }

    checkCosmicBonus(reelGrid) {
        // Space theme: Constellation bonus
        const spaceSymbols = ['🚀', '👽', '🛸', '🌟'];
        let cosmicCount = 0;
        
        reelGrid.forEach(reel => {
            reel.forEach(symbol => {
                if (spaceSymbols.includes(symbol)) {
                    cosmicCount++;
                }
            });
        });
        
        if (cosmicCount >= 8) {
            const bonus = this.currentBet * cosmicCount * 5;
            return { type: 'COSMIC_BONUS', amount: bonus, cosmicSymbols: cosmicCount };
        }
        return null;
    }

    checkMagicBonus(reelGrid) {
        // Fantasy theme: Spell combination bonus
        const magicSymbols = ['🧙‍♂️', '🔮', '📖', '🧪'];
        const uniqueMagicSymbols = new Set();
        
        reelGrid.forEach(reel => {
            reel.forEach(symbol => {
                if (magicSymbols.includes(symbol)) {
                    uniqueMagicSymbols.add(symbol);
                }
            });
        });
        
        if (uniqueMagicSymbols.size >= 3) {
            const bonus = this.currentBet * uniqueMagicSymbols.size * 15;
            return { type: 'SPELL_BONUS', amount: bonus, spellComponents: uniqueMagicSymbols.size };
        }
        return null;
    }

    checkGoldRushBonus(reelGrid) {
        // Western theme: Gold strike bonus
        let goldCount = 0;
        reelGrid.forEach(reel => {
            reel.forEach(symbol => {
                if (symbol === '💰') {
                    goldCount++;
                }
            });
        });
        
        if (goldCount >= 4) {
            const bonus = this.currentBet * goldCount * 12;
            return { type: 'GOLD_RUSH_BONUS', amount: bonus, goldStrike: goldCount };
        }
        return null;
    }

    checkElectricBonus(reelGrid) {
        // Neon theme: Circuit connection bonus
        let electricSymbols = 0;
        reelGrid.forEach(reel => {
            reel.forEach(symbol => {
                if (['⚡', '🔋', '💡'].includes(symbol)) {
                    electricSymbols++;
                }
            });
        });
        
        if (electricSymbols >= 6) {
            const bonus = this.currentBet * electricSymbols * 7;
            return { type: 'ELECTRIC_BONUS', amount: bonus, circuitPower: electricSymbols };
        }
        return null;
    }

    countSpecialSymbols(reelGrid, symbolType) {
        let count = 0;
        for (let reel = 0; reel < reelGrid.length; reel++) {
            for (let row = 0; row < reelGrid[reel].length; row++) {
                if (reelGrid[reel][row] === symbolType) {
                    count++;
                }
            }
        }
        return count;
    }

    checkBonusFeatures(reelGrid, scatterCount, bonusCount) {
        const bonusResults = [];

        // Free spins from scatter symbols
        if (scatterCount >= 3) {
            const freeSpinsAwarded = scatterCount * 3 + (this.currentTheme === 'fantasy' ? 5 : 0);
            this.bonusFeatures.freeSpins += freeSpinsAwarded;
            this.bonusFeatures.multiplier = Math.min(this.bonusFeatures.multiplier + 1, 4);
            
            bonusResults.push({
                type: 'FREE_SPINS',
                awarded: freeSpinsAwarded,
                scatterCount,
                multiplier: this.bonusFeatures.multiplier,
                theme: this.currentTheme
            });
        }

        // Theme bonus round
        if (bonusCount >= 3) {
            const themeBonusResult = this.triggerThemeBonusRound(bonusCount);
            bonusResults.push(themeBonusResult);
        }

        return bonusResults;
    }

    triggerThemeBonusRound(bonusCount) {
        this.bonusFeatures.themeBonus = true;
        
        // Theme-specific bonus rounds
        const bonusMultiplier = bonusCount * 2;
        let bonusWin = 0;
        
        switch (this.currentTheme) {
            case 'egyptian':
                bonusWin = this.treasureHuntBonus(bonusMultiplier);
                break;
            case 'ocean':
                bonusWin = this.sunkenTreasureBonus(bonusMultiplier);
                break;
            case 'space':
                bonusWin = this.planetExplorationBonus(bonusMultiplier);
                break;
            case 'fantasy':
                bonusWin = this.dragonHordeBonus(bonusMultiplier);
                break;
            case 'western':
                bonusWin = this.bankHeistBonus(bonusMultiplier);
                break;
            case 'neon':
                bonusWin = this.dataStreamBonus(bonusMultiplier);
                break;
        }
        
        this.balance += bonusWin;
        this.bonusFeatures.themeBonus = false;
        
        return {
            type: 'THEME_BONUS_ROUND',
            theme: this.currentTheme,
            bonusWin,
            bonusMultiplier,
            description: `${this.themeConfig.name} Special Bonus`
        };
    }

    treasureHuntBonus(multiplier) {
        // Egyptian treasure hunt
        const treasures = [50, 100, 250, 500, 1000];
        const selectedTreasures = Math.floor(Math.random() * 3) + 2;
        let totalWin = 0;
        
        for (let i = 0; i < selectedTreasures; i++) {
            const treasure = treasures[Math.floor(Math.random() * treasures.length)];
            totalWin += treasure * multiplier;
        }
        
        return totalWin;
    }

    sunkenTreasureBonus(multiplier) {
        // Ocean diving bonus
        const depths = [10, 25, 50, 100, 200];
        const totalWin = depths[Math.floor(Math.random() * depths.length)] * this.currentBet * multiplier;
        return totalWin;
    }

    planetExplorationBonus(multiplier) {
        // Space exploration bonus
        const planets = [30, 60, 120, 300, 600];
        const totalWin = planets[Math.floor(Math.random() * planets.length)] * this.currentBet * multiplier;
        return totalWin;
    }

    dragonHordeBonus(multiplier) {
        // Fantasy dragon horde
        const hordeValues = [75, 150, 300, 750, 1500];
        const totalWin = hordeValues[Math.floor(Math.random() * hordeValues.length)] * multiplier;
        return totalWin;
    }

    bankHeistBonus(multiplier) {
        // Western bank robbery
        const loot = [40, 80, 200, 400, 800];
        const totalWin = loot[Math.floor(Math.random() * loot.length)] * this.currentBet * multiplier;
        return totalWin;
    }

    dataStreamBonus(multiplier) {
        // Neon data hack
        const dataValues = [35, 70, 175, 350, 700];
        const totalWin = dataValues[Math.floor(Math.random() * dataValues.length)] * this.currentBet * multiplier;
        return totalWin;
    }

    checkAllWins(reelGrid) {
        const wins = [];
        for (let line = 0; line < this.paylines; line++) {
            const lineWin = this.checkPaylineWin(reelGrid, line);
            if (lineWin) {
                wins.push(lineWin);
            }
        }
        return wins;
    }

    checkPaylineWin(reelGrid, paylineIndex) {
        const paylinePatterns = this.getPaylinePatterns();
        const pattern = paylinePatterns[paylineIndex % paylinePatterns.length];
        const lineSymbols = pattern.map((pos, reelIndex) => reelGrid[reelIndex][pos]);
        
        let matchCount = 1;
        let symbol = lineSymbols[0];
        
        for (let i = 1; i < lineSymbols.length; i++) {
            if (lineSymbols[i] === symbol || 
                lineSymbols[i] === this.specialSymbols.wild || 
                symbol === this.specialSymbols.wild) {
                if (symbol === this.specialSymbols.wild && lineSymbols[i] !== this.specialSymbols.wild) {
                    symbol = lineSymbols[i];
                }
                matchCount++;
            } else {
                break;
            }
        }

        if (matchCount >= 3 && this.payouts[symbol] && this.payouts[symbol][matchCount]) {
            const basePayout = this.payouts[symbol][matchCount];
            const payout = basePayout * this.betPerLine;
            
            return {
                payline: paylineIndex + 1,
                symbol,
                matchCount,
                payout,
                theme: this.currentTheme,
                positions: pattern.slice(0, matchCount)
            };
        }

        return null;
    }

    getPaylinePatterns() {
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
            [0, 1, 0, 1, 0], // Zigzag top
            [2, 1, 2, 1, 2], // Zigzag bottom
            [0, 2, 0, 2, 0], // Large zigzag
            [1, 0, 0, 0, 1], // V shallow
            [1, 2, 2, 2, 1], // ^ shallow
            [0, 0, 2, 0, 0], // Dip
            [2, 2, 0, 2, 2], // Peak
            [0, 1, 1, 1, 0], // Plateau top
            [2, 1, 1, 1, 2], // Plateau bottom
            [1, 1, 0, 1, 1], // Middle dip
            [1, 1, 2, 1, 1]  // Middle peak
        ];
    }

    checkAchievements(reelGrid, totalWin, bonusResults) {
        const newAchievements = [];
        
        // Theme-specific achievements
        if (totalWin > this.currentBet * 100) {
            newAchievements.push({
                id: `${this.currentTheme}_big_win`,
                name: `${this.themeConfig.name} Big Win`,
                description: `Won over 100x bet in ${this.currentTheme} theme`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Theme mastery achievement
        if (bonusResults.some(result => result.type === 'THEME_BONUS_ROUND')) {
            newAchievements.push({
                id: `${this.currentTheme}_master`,
                name: `${this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1)} Master`,
                description: `Triggered the ${this.currentTheme} theme bonus round`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Add to achievements collection
        this.achievements.push(...newAchievements);
        
        return newAchievements;
    }

    getGameState() {
        return {
            theme: this.currentTheme,
            themeName: this.name,
            availableThemes: this.availableThemes,
            balance: this.balance,
            currentBet: this.currentBet,
            betPerLine: this.betPerLine,
            freeSpins: this.bonusFeatures.freeSpins,
            multiplier: this.bonusFeatures.multiplier,
            themeFeatures: this.themeConfig.themeFeatures,
            achievements: this.achievements.slice(-10),
            lastSpin: this.lastSpin,
            themeColors: this.themeConfig.backgroundColor
        };
    }

    resetBonusFeatures() {
        this.bonusFeatures = {
            freeSpins: 0,
            multiplier: 1,
            bonusRound: false,
            themeBonus: false
        };
    }
}

module.exports = ThemedSlotMachines;