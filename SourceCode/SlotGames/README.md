# Slot Games Collection

This directory contains a comprehensive collection of slot game implementations for the Krissi Pimpin' Pimpire gaming platform.

## Available Slot Games

### 1. Classic Slots (`ClassicSlots.js`)
- **Type**: Traditional 3-reel slot machine
- **Features**: Simple gameplay, classic fruit symbols
- **Paylines**: 5 traditional lines
- **Special Features**: Basic wild symbols, straightforward payouts

### 2. Video Slots (`VideoSlots.js`)
- **Type**: Modern 5-reel video slot
- **Name**: "Mega Fortune Video Slots"
- **Paylines**: 25 lines
- **Features**: 
  - Wild symbols with substitution
  - Scatter pays
  - Free spins bonus rounds
  - Multipliers
  - Bonus rounds
  - 5x3 reel grid

### 3. Progressive Jackpot Slots (`ProgressiveJackpotSlots.js`)
- **Type**: Network-style progressive jackpot system
- **Name**: "Mega Millions Progressive"
- **Paylines**: 50 lines
- **Features**:
  - 5 Progressive jackpot levels (Mini, Minor, Major, Grand, Mega)
  - Jackpot bonus games
  - Mystery jackpot triggers
  - Wild multipliers
  - 5x4 reel grid
  - Minimum bet: $2.50

### 4. Themed Slot Machines (`ThemedSlotMachines.js`)
- **Type**: Multiple themed slot experiences
- **Available Themes**:
  - **Egyptian** - "Treasures of the Pharaoh"
  - **Ocean** - "Deep Sea Adventures"
  - **Space** - "Galactic Fortune"
  - **Fantasy** - "Magical Realms"
  - **Western** - "Wild West Gold"
  - **Neon** - "Neon City Nights"
- **Features**:
  - Theme-specific symbols and bonuses
  - Unique bonus rounds per theme
  - Theme switching capability
  - Achievement system
  - Special themed mechanics

## Game Features Overview

### Common Features Across All Slots:
- ✅ Balance management
- ✅ Configurable betting
- ✅ Win line detection
- ✅ Payout calculations
- ✅ Game state tracking

### Advanced Features:
- 🎰 **Wild Symbols**: Substitute for other symbols
- 🌟 **Scatter Pays**: Trigger bonuses anywhere on reels
- 🎁 **Bonus Rounds**: Interactive mini-games
- 🔄 **Free Spins**: Spins without betting
- ✨ **Multipliers**: Increase win amounts
- 🏆 **Progressive Jackpots**: Growing prize pools
- 🎨 **Themes**: Visual and mechanical variety
- 🏅 **Achievements**: Player progression system

## Integration

All slot games implement a consistent interface:

```javascript
// Initialize game
const game = new SlotGameClass();
const initResult = game.initialize();

// Set bet amount
const betResult = game.setBet(betAmount);

// Spin the reels
const spinResult = game.spin();

// Get current state
const gameState = game.getGameState();
```

## API Endpoints

The main server provides endpoints for all slot games:
- `POST /api/games/slots/init` - Initialize any slot game
- `POST /api/games/slots/{gameId}/spin` - Spin the reels
- `GET /api/games/slots/{gameId}/state` - Get game state

## Configuration

Slot games are configured in `KnK_Codex_v1.7.8.json` with:
- Game types and variants
- Payout tables
- Feature settings
- Theme configurations
