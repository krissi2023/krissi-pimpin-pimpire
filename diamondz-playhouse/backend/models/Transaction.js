const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['comic_purchase', 'points_purchase', 'game_win', 'game_loss', 'refund'],
    required: true
  },
  comicId: String,
  amount: {
    type: Number,
    required: true
  },
  stripeSessionId: String,
  stripePaymentIntentId: String,
  rewards: {
    goldPoints: Number,
    arcadeCredits: Number,
    pbPoints: Number
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ stripeSessionId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
