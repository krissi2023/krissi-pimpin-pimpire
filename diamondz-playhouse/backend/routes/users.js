const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Users can only access their own profile
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      goldPoints: user.goldPoints,
      pbPoints: user.pbPoints,
      arcadeCredits: user.arcadeCredits,
      purchasedComics: user.purchasedComics,
      totalWins: user.totalWins,
      gamesPlayed: user.gamesPlayed,
      joinedAt: user.joinedAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/users/:id/inventory
 * @desc    Get user's purchased comics and unlocked content
 * @access  Private
 */
router.get('/:id/inventory', authMiddleware, async (req, res) => {
  try {
    // Users can only access their own inventory
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      comics: user.purchasedComics,
      puzzles: user.unlockedPuzzles,
      wallpapers: user.unlockedWallpapers
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      goldPoints: user.goldPoints,
      pbPoints: user.pbPoints,
      arcadeCredits: user.arcadeCredits,
      purchasedComics: user.purchasedComics,
      totalWins: user.totalWins,
      gamesPlayed: user.gamesPlayed,
      joinedAt: user.joinedAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
