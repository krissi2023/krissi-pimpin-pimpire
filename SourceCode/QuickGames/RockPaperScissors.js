/**
 * Rock Paper Scissors - Quick Game
 * Classic hand game for quick entertainment
 */

'use strict';

class RockPaperScissors {
    constructor() {
        this.name = 'Rock Paper Scissors';
        this.type = 'QuickGame';
        this.choices = ['rock', 'paper', 'scissors'];
        this.playerScore = 0;
        this.computerScore = 0;
        this.gamesPlayed = 0;
        this.gameHistory = [];
    }

    initialize() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.gamesPlayed = 0;
        this.gameHistory = [];
        
        console.log(`${this.name} initialized`);
        return {
            game: this.name,
            choices: this.choices,
            playerScore: this.playerScore,
            computerScore: this.computerScore
        };
    }

    play(playerChoice) {
        if (!this.choices.includes(playerChoice.toLowerCase())) {
            return {
                success: false,
                error: `Invalid choice. Must be one of: ${this.choices.join(', ')}`
            };
        }

        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice.toLowerCase(), computerChoice);
        
        // Update scores
        if (result.winner === 'player') {
            this.playerScore++;
        } else if (result.winner === 'computer') {
            this.computerScore++;
        }

        this.gamesPlayed++;
        
        // Store game in history
        const gameResult = {
            round: this.gamesPlayed,
            playerChoice: playerChoice.toLowerCase(),
            computerChoice,
            result: result.outcome,
            winner: result.winner
        };
        
        this.gameHistory.push(gameResult);

        return {
            success: true,
            round: this.gamesPlayed,
            playerChoice: playerChoice.toLowerCase(),
            computerChoice,
            result: result.outcome,
            winner: result.winner,
            scores: {
                player: this.playerScore,
                computer: this.computerScore,
                ties: this.gamesPlayed - this.playerScore - this.computerScore
            }
        };
    }

    getComputerChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return { outcome: 'tie', winner: 'none' };
        }

        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        if (winConditions[playerChoice] === computerChoice) {
            return { outcome: 'win', winner: 'player' };
        } else {
            return { outcome: 'lose', winner: 'computer' };
        }
    }

    bestOfGame(rounds) {
        const targetWins = Math.ceil(rounds / 2);
        
        return {
            targetRounds: rounds,
            targetWins,
            currentScores: {
                player: this.playerScore,
                computer: this.computerScore
            },
            isComplete: this.playerScore >= targetWins || this.computerScore >= targetWins,
            champion: this.playerScore >= targetWins ? 'player' : 
                     this.computerScore >= targetWins ? 'computer' : 'none'
        };
    }

    getStats() {
        if (this.gamesPlayed === 0) {
            return {
                gamesPlayed: 0,
                winRate: 0,
                favoriteChoice: 'none',
                history: []
            };
        }

        const playerChoices = this.gameHistory.map(game => game.playerChoice);
        const choiceCounts = this.choices.reduce((acc, choice) => {
            acc[choice] = playerChoices.filter(c => c === choice).length;
            return acc;
        }, {});

        const favoriteChoice = Object.keys(choiceCounts).reduce((a, b) => 
            choiceCounts[a] > choiceCounts[b] ? a : b
        );

        return {
            gamesPlayed: this.gamesPlayed,
            winRate: (this.playerScore / this.gamesPlayed * 100).toFixed(1),
            scores: {
                wins: this.playerScore,
                losses: this.computerScore,
                ties: this.gamesPlayed - this.playerScore - this.computerScore
            },
            favoriteChoice,
            choiceBreakdown: choiceCounts,
            history: this.gameHistory.slice(-10) // Last 10 games
        };
    }

    reset() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.gamesPlayed = 0;
        this.gameHistory = [];
        
        return { success: true, message: 'Game reset successfully' };
    }
}

module.exports = RockPaperScissors;