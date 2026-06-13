const dbAdapter = require('../adapters/dbAdapter');
const { calculateFootprint } = require('../utils/emissionFactors');
const geminiService = require('./geminiService');
const badgeService = require('./badgeService');

const footprintService = {
  async createFootprintLog(userId, inputs) {
    const { total, breakdown } = calculateFootprint(inputs);
    
    // Call Gemini for advice
    const advice = await geminiService.getCarbonAdvice(inputs, breakdown, total);

    const footprintData = {
      userId,
      inputs,
      breakdown,
      total,
      advice,
      date: new Date().toISOString()
    };

    const savedRecord = await dbAdapter.insert('footprints', footprintData);

    // Badge check: First footprint calculation
    const userFootprints = await dbAdapter.find(
      'footprints',
      f => f.userId === userId,
      query => query.where('userId', '==', userId).limit(2)
    );

    if (userFootprints.length === 1) {
      const existingBadge = await dbAdapter.findOne(
        'badges',
        b => b.userId === userId && b.badgeType === 'beginner',
        query => query.where('userId', '==', userId).where('badgeType', '==', 'beginner')
      );

      if (!existingBadge) {
        await dbAdapter.insert('badges', {
          userId,
          badgeType: 'beginner',
          title: 'Eco Beginner',
          description: 'Completed your first carbon footprint calculation!',
          unlockedAt: new Date().toISOString()
        });
      }
    }

    return savedRecord;
  },

  async getFootprintHistory(userId) {
    const logs = await dbAdapter.find(
      'footprints',
      f => f.userId === userId,
      query => query.where('userId', '==', userId).orderBy('date', 'desc')
    );
    // Ensure sorted descending
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    return logs;
  },

  async getFootprintSummary(userId) {
    const logs = await dbAdapter.find(
      'footprints',
      f => f.userId === userId,
      query => query.where('userId', '==', userId).orderBy('date', 'desc').limit(2)
    );
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (logs.length === 0) {
      return {
        current: null,
        previous: null,
        difference: 0,
        percentageChange: 0
      };
    }

    const current = logs[0];
    const previous = logs[1] || null;
    let difference = 0;
    let percentageChange = 0;

    if (previous) {
      difference = Math.round((current.total - previous.total) * 100) / 100;
      percentageChange = Math.round(((current.total - previous.total) / previous.total) * 10000) / 100;
    }

    return {
      current,
      previous,
      difference,
      percentageChange
    };
  }
};

module.exports = footprintService;
