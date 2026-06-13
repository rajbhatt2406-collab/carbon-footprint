const dbAdapter = require('../adapters/dbAdapter');

const BADGES_CONFIG = {
  beginner: {
    title: 'Eco Beginner',
    description: 'Calculated your carbon footprint for the first time.'
  },
  eco_explorer: {
    title: 'Eco Explorer',
    description: 'Successfully completed at least 5 weekly eco challenges.'
  },
  green_warrior: {
    title: 'Green Warrior',
    description: 'Reduced your monthly carbon footprint by 20% or more.'
  },
  carbon_hero: {
    title: 'Carbon Hero',
    description: 'Reduced your monthly carbon footprint by 50% or more.'
  }
};

const badgeService = {
  async getBadgesForUser(userId) {
    // Evaluate to ensure badges are up to date
    await this.evaluateFootprintBadges(userId);

    // Retrieve unlocked badges
    const unlocked = await dbAdapter.find(
      'badges',
      b => b.userId === userId,
      query => query.where('userId', '==', userId)
    );

    // Format response matching config list
    return Object.keys(BADGES_CONFIG).map(type => {
      const unlockRecord = unlocked.find(u => u.badgeType === type);
      return {
        badgeType: type,
        title: BADGES_CONFIG[type].title,
        description: BADGES_CONFIG[type].description,
        unlocked: !!unlockRecord,
        unlockedAt: unlockRecord ? unlockRecord.unlockedAt : null
      };
    });
  },

  async evaluateFootprintBadges(userId) {
    // 1. Fetch user data (footprints, completed challenges, existing badges)
    const footprints = await dbAdapter.find(
      'footprints',
      f => f.userId === userId,
      query => query.where('userId', '==', userId).orderBy('date', 'asc')
    );

    // Chronological order is guaranteed by orderby or sorted in mock find
    footprints.sort((a, b) => new Date(a.date) - new Date(b.date));

    const completedChallenges = await dbAdapter.find(
      'challenges',
      c => c.userId === userId && c.completed === true,
      query => query.where('userId', '==', userId).where('completed', '==', true)
    );

    const existingBadges = await dbAdapter.find(
      'badges',
      b => b.userId === userId,
      query => query.where('userId', '==', userId)
    );

    const hasBadge = (type) => existingBadges.some(b => b.badgeType === type);
    
    const awardBadge = async (type) => {
      const badgeData = {
        userId,
        badgeType: type,
        title: BADGES_CONFIG[type].title,
        description: BADGES_CONFIG[type].description,
        unlockedAt: new Date().toISOString()
      };
      await dbAdapter.insert('badges', badgeData);
      console.log(`User ${userId} awarded badge: ${type}`);
    };

    // 2. Evaluate Beginner badge (>= 1 calculation)
    if (footprints.length >= 1 && !hasBadge('beginner')) {
      await awardBadge('beginner');
    }

    // 3. Evaluate Eco Explorer badge (>= 5 challenges completed)
    if (completedChallenges.length >= 5 && !hasBadge('eco_explorer')) {
      await awardBadge('eco_explorer');
    }

    // 4. Evaluate Green Warrior (20% reduction) and Carbon Hero (50% reduction)
    if (footprints.length >= 2) {
      const firstFootprint = footprints[0].total;
      const latestFootprint = footprints[footprints.length - 1].total;

      if (firstFootprint > 0) {
        const reductionRatio = (firstFootprint - latestFootprint) / firstFootprint;

        if (reductionRatio >= 0.20 && !hasBadge('green_warrior')) {
          await awardBadge('green_warrior');
        }

        if (reductionRatio >= 0.50 && !hasBadge('carbon_hero')) {
          await awardBadge('carbon_hero');
        }
      }
    }
  }
};

module.exports = badgeService;
