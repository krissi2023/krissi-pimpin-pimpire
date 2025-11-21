const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  comicId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: String,
  theme: String,
  puzzleIncluded: {
    type: Boolean,
    default: true
  },
  wallpaperIncluded: {
    type: Boolean,
    default: true
  },
  goldPointsReward: {
    type: Number,
    default: 100
  },
  arcadeCredits: {
    type: Number,
    default: 5000
  },
  pbPoints: {
    type: Number,
    default: 50
  },
  puzzlesCount: {
    type: Number,
    default: 3
  },
  wallpapersCount: {
    type: Number,
    default: 5
  },
  bonusContent: {
    characterBios: Boolean,
    behindTheScenes: Boolean,
    conceptArt: Boolean,
    exclusiveChapter: Boolean
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comic', comicSchema);
