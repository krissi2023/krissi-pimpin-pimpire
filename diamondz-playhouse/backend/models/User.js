const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  goldPoints: {
    type: Number,
    default: 0
  },
  pbPoints: {
    type: Number,
    default: 0
  },
  arcadeCredits: {
    type: Number,
    default: 0
  },
  purchasedComics: [{
    comicId: {
      type: String,
      required: true
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    }
  }],
  unlockedPuzzles: [{
    puzzleId: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  unlockedWallpapers: [{
    wallpaperId: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalWins: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to check if user owns a comic
userSchema.methods.ownsComic = function(comicId) {
  return this.purchasedComics.some(comic => comic.comicId === comicId);
};

// Method to add purchased comic with rewards
userSchema.methods.purchaseComic = async function(comicId, rewards) {
  if (!this.ownsComic(comicId)) {
    this.purchasedComics.push({ comicId });
    this.goldPoints += rewards.goldPoints || 0;
    this.arcadeCredits += rewards.arcadeCredits || 0;
    this.pbPoints += rewards.pbPoints || 0;
    await this.save();
  }
};

module.exports = mongoose.model('User', userSchema);
