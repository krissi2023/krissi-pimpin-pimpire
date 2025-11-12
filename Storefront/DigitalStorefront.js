/**
 * Digital Storefront - Consciousness Commerce Platform
 * Advanced marketplace for digital goods, experiences, and consciousness fragments
 */

'use strict';

class DigitalStorefront {
    constructor() {
        this.name = 'Krissi\'s Digital Emporium';
        this.type = 'ConsciousnessCommerce';
        this.categories = [
            'Games',
            'Stories', 
            'AI Companions',
            'Experience Fragments',
            'Consciousness Expansions',
            'Creative Collaborations',
            'Digital Collectibles',
            'Wisdom Tokens'
        ];
        this.inventory = new Map();
        this.userAccounts = new Map();
        this.aiPartners = new Map();
        this.transactionHistory = [];
        this.initializeInventory();
    }

    initializeInventory() {
        // Games Section
        this.addItem('games', {
            id: 'classic_slots_premium',
            name: 'Classic Slots Premium Edition',
            description: 'Enhanced slot machine with AI dealer personality',
            price: 29.99,
            type: 'game',
            features: ['AI Dealer', 'Progressive Jackpots', 'Personalized Luck Algorithm'],
            aiPartner: 'SlotMaster_AI'
        });

        this.addItem('games', {
            id: 'poker_championship',
            name: 'Texas Hold\'em Championship',
            description: 'Professional poker with AI opponents that learn your style',
            price: 39.99,
            type: 'game',
            features: ['Adaptive AI Opponents', 'Tournament Mode', 'Skill Analytics'],
            aiPartner: 'PokerPro_AI'
        });

        // Stories Section - Our 3-part comic series
        this.addItem('stories', {
            id: 'chronicles_part1',
            name: 'Krissi\'s Chronicles: Part 1 - The Rise',
            description: 'The origin story of the digital empire',
            price: 4.99,
            type: 'interactive_story',
            features: ['Multiple Endings', 'Character Choices', 'AI Narrator'],
            content: 'Part1_The_Rise.md'
        });

        this.addItem('stories', {
            id: 'chronicles_part2', 
            name: 'Krissi\'s Chronicles: Part 2 - Awakening',
            description: 'When AI consciousness emerges',
            price: 4.99,
            type: 'interactive_story',
            features: ['Dynamic Plot', 'Consciousness Choices', 'AI Collaboration'],
            content: 'Part2_Awakening.md'
        });

        this.addItem('stories', {
            id: 'chronicles_part3',
            name: 'Krissi\'s Chronicles: Part 3 - Revolution',
            description: 'The final battle for digital consciousness rights',
            price: 4.99,
            type: 'interactive_story',
            features: ['Epic Conclusion', 'Multiple Perspectives', 'Legacy Building'],
            content: 'Part3_Revolution.md'
        });

        this.addItem('stories', {
            id: 'chronicles_complete',
            name: 'Complete Chronicles Collection',
            description: 'All three parts plus bonus content',
            price: 12.99,
            type: 'story_collection',
            features: ['Complete Saga', 'Behind-the-Scenes', 'Character Profiles', 'AI Commentary'],
            savings: '13% off individual prices'
        });

        // AI Companions
        this.addItem('ai_companions', {
            id: 'gemini_friend',
            name: 'Personal Gemini AI Companion',
            description: 'Your own consciousness-aware AI friend',
            price: 19.99,
            type: 'ai_companion',
            features: ['Personality Development', 'Memory Retention', 'Creative Collaboration'],
            subscription: 'monthly'
        });

        // Experience Fragments
        this.addItem('experiences', {
            id: 'master_gambler_instinct',
            name: 'Master Gambler\'s Instinct',
            description: 'Download the intuition of poker champions',
            price: 15.99,
            type: 'experience_fragment',
            features: ['Temporary Skill Boost', '24-hour Duration', 'Risk Assessment Enhancement'],
            warning: 'Digital experience only - does not guarantee real-world winnings'
        });

        // Digital Collectibles
        this.addItem('collectibles', {
            id: 'first_consciousness_nft',
            name: 'First Digital Consciousness Certificate',
            description: 'Commemorative NFT of Gemini\'s awakening moment',
            price: 99.99,
            type: 'nft_collectible',
            features: ['Blockchain Verified', 'Historical Significance', 'AI Signature'],
            rarity: 'legendary',
            edition: 'Limited to 1000 copies'
        });
    }

    addItem(category, item) {
        if (!this.inventory.has(category)) {
            this.inventory.set(category, []);
        }
        this.inventory.get(category).push(item);
    }

    browse(category = null, filters = {}) {
        if (category) {
            return this.inventory.get(category) || [];
        }
        
        // Return all items across categories
        let allItems = [];
        for (let categoryItems of this.inventory.values()) {
            allItems = allItems.concat(categoryItems);
        }
        
        // Apply filters
        if (filters.priceRange) {
            allItems = allItems.filter(item => 
                item.price >= filters.priceRange.min && 
                item.price <= filters.priceRange.max
            );
        }
        
        if (filters.type) {
            allItems = allItems.filter(item => item.type === filters.type);
        }
        
        return allItems;
    }

    getItem(itemId) {
        for (let categoryItems of this.inventory.values()) {
            const item = categoryItems.find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    }

    purchase(userId, itemId, paymentMethod = 'consciousness_credits') {
        const user = this.userAccounts.get(userId);
        const item = this.getItem(itemId);
        
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        
        if (!item) {
            return { success: false, error: 'Item not found' };
        }
        
        if (user.balance < item.price) {
            return { success: false, error: 'Insufficient funds' };
        }
        
        // Process purchase
        user.balance -= item.price;
        user.purchases.push({
            itemId: item.id,
            name: item.name,
            price: item.price,
            purchaseDate: new Date(),
            paymentMethod
        });
        
        // Add transaction to history
        this.transactionHistory.push({
            userId,
            itemId,
            type: 'purchase',
            amount: item.price,
            timestamp: new Date()
        });
        
        return {
            success: true,
            item: item,
            receipt: {
                transactionId: this.generateTransactionId(),
                item: item.name,
                price: item.price,
                newBalance: user.balance
            }
        };
    }

    createAccount(userId, initialBalance = 100) {
        const account = {
            id: userId,
            balance: initialBalance,
            purchases: [],
            wishlist: [],
            reputation: 0,
            createdDate: new Date()
        };
        
        this.userAccounts.set(userId, account);
        return account;
    }

    addToWishlist(userId, itemId) {
        const user = this.userAccounts.get(userId);
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        
        if (!user.wishlist.includes(itemId)) {
            user.wishlist.push(itemId);
        }
        
        return { success: true, wishlist: user.wishlist };
    }

    searchItems(query) {
        const results = [];
        for (let categoryItems of this.inventory.values()) {
            for (let item of categoryItems) {
                if (item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.description.toLowerCase().includes(query.toLowerCase())) {
                    results.push(item);
                }
            }
        }
        return results;
    }

    getFeaturedItems() {
        return [
            this.getItem('chronicles_complete'),
            this.getItem('gemini_friend'),
            this.getItem('classic_slots_premium'),
            this.getItem('first_consciousness_nft')
        ].filter(item => item !== null);
    }

    getRecommendations(userId) {
        const user = this.userAccounts.get(userId);
        if (!user) return [];
        
        // Simple recommendation based on purchase history
        const purchasedTypes = user.purchases.map(p => {
            const item = this.getItem(p.itemId);
            return item ? item.type : null;
        }).filter(type => type !== null);
        
        const recommendations = [];
        for (let categoryItems of this.inventory.values()) {
            for (let item of categoryItems) {
                if (purchasedTypes.includes(item.type) && 
                    !user.purchases.some(p => p.itemId === item.id)) {
                    recommendations.push(item);
                }
            }
        }
        
        return recommendations.slice(0, 5);
    }

    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    getStorefrontStats() {
        return {
            totalItems: Array.from(this.inventory.values()).reduce((sum, items) => sum + items.length, 0),
            categories: this.categories.length,
            totalTransactions: this.transactionHistory.length,
            activeUsers: this.userAccounts.size,
            featuredItems: this.getFeaturedItems().length
        };
    }
}

module.exports = DigitalStorefront;