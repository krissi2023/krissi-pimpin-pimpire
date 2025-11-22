const express = require('express');
const router = express.Router();
const Comic = require('../models/Comic');

/**
 * @route   GET /api/comics
 * @desc    Get all comics
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Try to fetch from database first
    const comics = await Comic.find({ isActive: true }).sort({ comicId: 1 });
    
    if (comics.length > 0) {
      // Convert MongoDB docs to plain objects and add 'id' field for frontend compatibility
      const formattedComics = comics.map(comic => ({
        ...comic.toObject(),
        id: comic.comicId
      }));
      return res.json(formattedComics);
    }
    
    // Fallback to hardcoded data if database is empty
    const comics = [
      // DIAMOND'S PERSPECTIVE - The Heist Trilogy
      {
        id: '1',
        title: 'The Velvet Touch',
        description: 'Episode 1 (Diamond\'s POV) - Diamond infiltrates Sterling\'s fortress vault with charm and skill',
        price: 999, // $9.99 in cents
        thumbnail: '/assets/comics/velvet-touch-cover.svg',
        theme: 'heist',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 100,
        arcadeCredits: 5000, // $50 in credits (100 credits = $1)
        pbPoints: 50,
        puzzlesCount: 3, // Multiple puzzles per comic
        wallpapersCount: 5, // Multiple wallpapers
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          diamondProfile: true
        }
      },
      {
        id: '2',
        title: 'Don\'t Hate the Player',
        description: 'Episode 2 (Diamond\'s POV) - Diamond faces King Pimpin\'s arcade-themed traps: Slots, Fish Tables, and Cards',
        price: 999,
        thumbnail: '/assets/comics/dont-hate-player-cover.svg',
        theme: 'arcade-heist',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 100,
        arcadeCredits: 5000, // $50 in credits
        pbPoints: 50,
        puzzlesCount: 3,
        wallpapersCount: 5,
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          slotMachineMinigame: true
        }
      },
      {
        id: '3',
        title: 'The Getaway Glitch',
        description: 'Episode 3 (Diamond\'s POV) - Diamond\'s daring escape with Yago trying to stop her. King Pimpin\' decides to pursue',
        price: 999,
        thumbnail: '/assets/comics/getaway-glitch-cover.svg',
        theme: 'action-romance',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 100,
        arcadeCredits: 5000, // $50 in credits
        pbPoints: 50,
        puzzlesCount: 3,
        wallpapersCount: 5,
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          yagoIntro: true
        }
      },
      // KING PIMPIN'S PERSPECTIVE - The Truth Revealed
      {
        id: '4',
        title: 'The Trap Card',
        description: 'Episode 4 (King Pimpin\'s POV) - He knew all along. Watch him activate "Arcade Mode" and let her play',
        price: 999,
        thumbnail: '/assets/comics/trap-card-cover.svg',
        theme: 'perspective-shift',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 100,
        arcadeCredits: 5000,
        pbPoints: 50,
        puzzlesCount: 3,
        wallpapersCount: 5,
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          kingPimpinProfile: true,
          yagoTechSpecs: true
        }
      },
      {
        id: '5',
        title: 'Respect the Hustle',
        description: 'Episode 5 (King Pimpin\'s POV) - King watches Diamond beat every trap. His admiration grows with each level',
        price: 999,
        thumbnail: '/assets/comics/respect-hustle-cover.svg',
        theme: 'arcade-commentary',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 100,
        arcadeCredits: 5000,
        pbPoints: 50,
        puzzlesCount: 3,
        wallpapersCount: 5,
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          gameMechanicsGuide: true
        }
      },
      {
        id: '6',
        title: 'The Chase Begins',
        description: 'Episode 6 (King Pimpin\'s POV) - She escaped with his car and his respect. Now the real game starts',
        price: 1299, // $12.99
        thumbnail: '/assets/comics/chase-begins-cover.svg',
        theme: 'romance-setup',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 150,
        arcadeCredits: 6500, // $65 in credits (premium comic)
        pbPoints: 75,
        puzzlesCount: 4,
        wallpapersCount: 7,
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          exclusiveChapter: true,
          season2Teaser: true
        }
      },
      // BONUS CONTENT
      {
        id: 'bonus-yago',
        title: 'Yago\'s Redemption',
        description: 'Bonus Story - How Yago plans to upgrade and redeem himself after getting hacked by Diamond',
        price: 799, // $7.99
        thumbnail: '/assets/comics/yago-redemption-cover.svg',
        theme: 'side-story',
        puzzleIncluded: true,
        wallpaperIncluded: true,
        goldPointsReward: 75,
        arcadeCredits: 4000, // $40 in credits
        pbPoints: 40,
        puzzlesCount: 2,
        wallpapersCount: 4,
        bonusContent: {
          characterBios: true,
          behindTheScenes: true,
          conceptArt: true,
          aiSideStory: true,
          yagoUpgradeTree: true
        }
      }
    ];

    res.json(comics);
  } catch (error) {
    console.error('Error fetching comics:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/comics/:id
 * @desc    Get single comic by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Fetch from database
    const comic = {
      id,
      title: 'The Rise',
      description: 'Part 1 of the epic saga',
      fullDescription: 'An epic tale of power, strategy, and digital dominance...',
      price: 999,
      thumbnail: '/assets/comics/rise-cover.jpg',
      pages: 45,
      theme: 'origin',
      puzzleIncluded: true,
      wallpaperIncluded: true,
      goldPointsReward: 100,
      arcadeTheme: 'diamondz-rise'
    };

    res.json(comic);
  } catch (error) {
    console.error('Error fetching comic:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/comics/:id/puzzles
 * @desc    Get all puzzles for a comic
 * @access  Private (must own comic)
 */
router.get('/:id/puzzles', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Check if user owns this comic
    
    const puzzles = [
      {
        id: `${id}-puzzle-1`,
        comicId: id,
        type: 'jigsaw',
        name: 'Character Portrait',
        difficulty: 'easy',
        pieces: 50,
        imageUrl: `/assets/puzzles/${id}-jigsaw-1.jpg`,
        completionReward: 25, // gold points
        timeBonus: true, // Extra rewards for fast completion
        completed: false
      },
      {
        id: `${id}-puzzle-2`,
        comicId: id,
        type: 'word_search',
        name: 'Hidden Words',
        difficulty: 'medium',
        words: ['diamond', 'power', 'rise', 'arcade', 'heist'],
        gridSize: 15,
        completionReward: 30,
        timeBonus: true,
        completed: false
      },
      {
        id: `${id}-puzzle-3`,
        comicId: id,
        type: 'jigsaw',
        name: 'Epic Scene',
        difficulty: 'hard',
        pieces: 150,
        imageUrl: `/assets/puzzles/${id}-jigsaw-2.jpg`,
        completionReward: 50,
        timeBonus: true,
        bonusReward: 10, // Extra PB points
        completed: false
      }
    ];

    res.json(puzzles);
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/comics/:id/wallpapers
 * @desc    Get all wallpapers for a comic
 * @access  Private (must own comic)
 */
router.get('/:id/wallpapers', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Check if user owns this comic
    
    const wallpapers = [
      {
        id: `${id}-wp-1`,
        name: 'Main Character',
        resolutions: [
          { size: '1920x1080', url: `/assets/wallpapers/${id}-character-1920x1080.jpg` },
          { size: '2560x1440', url: `/assets/wallpapers/${id}-character-2560x1440.jpg` },
          { size: '3840x2160', url: `/assets/wallpapers/${id}-character-3840x2160.jpg` }
        ]
      },
      {
        id: `${id}-wp-2`,
        name: 'Epic Scene',
        resolutions: [
          { size: '1920x1080', url: `/assets/wallpapers/${id}-scene-1920x1080.jpg` },
          { size: '2560x1440', url: `/assets/wallpapers/${id}-scene-2560x1440.jpg` },
          { size: '3840x2160', url: `/assets/wallpapers/${id}-scene-3840x2160.jpg` }
        ]
      },
      {
        id: `${id}-wp-3`,
        name: 'Logo & Branding',
        resolutions: [
          { size: '1920x1080', url: `/assets/wallpapers/${id}-logo-1920x1080.jpg` },
          { size: '2560x1440', url: `/assets/wallpapers/${id}-logo-2560x1440.jpg` },
          { size: '3840x2160', url: `/assets/wallpapers/${id}-logo-3840x2160.jpg` }
        ]
      },
      {
        id: `${id}-wp-4`,
        name: 'Mobile Wallpaper 1',
        resolutions: [
          { size: '1080x1920', url: `/assets/wallpapers/${id}-mobile1-1080x1920.jpg` },
          { size: '1440x2960', url: `/assets/wallpapers/${id}-mobile1-1440x2960.jpg` }
        ]
      },
      {
        id: `${id}-wp-5`,
        name: 'Mobile Wallpaper 2',
        resolutions: [
          { size: '1080x1920', url: `/assets/wallpapers/${id}-mobile2-1080x1920.jpg` },
          { size: '1440x2960', url: `/assets/wallpapers/${id}-mobile2-1440x2960.jpg` }
        ]
      }
    ];

    res.json(wallpapers);
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/comics/:id/complete-puzzle
 * @desc    Mark puzzle as completed and award points
 * @access  Private
 */
router.post('/:id/complete-puzzle', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, completionTime } = req.body;
    
    // TODO: Award points to user
    const pointsAwarded = 50;
    
    res.json({ 
      success: true, 
      pointsAwarded,
      message: `Puzzle completed! You earned ${pointsAwarded} gold points!`
    });
  } catch (error) {
    console.error('Error completing puzzle:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
