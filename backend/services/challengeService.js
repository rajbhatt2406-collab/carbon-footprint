const dbAdapter = require('../adapters/dbAdapter');
const geminiService = require('./geminiService');
const badgeController = require('../controllers/badgeController');

// Helper to calculate current Monday of the week
function getMondayOfCurrentWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

const challengeService = {
  async getWeeklyChallenges(userId) {
    const weekStart = getMondayOfCurrentWeek();
    
    // Check if user exists using findOne for mock compatibility
    const user = await dbAdapter.findOne(
      'users',
      u => u.id === userId,
      query => query.doc(userId)
    );
    if (!user) {
      throw new Error('User not found');
    }

    // Check if challenges already exist for this week
    let activeChallenges = await dbAdapter.find(
      'challenges',
      c => c.userId === userId && c.weekStartDate === weekStart,
      query => query.where('userId', '==', userId).where('weekStartDate', '==', weekStart)
    );

    if (activeChallenges.length === 0) {
      console.log(`Generating new weekly challenges for user ${userId} for week ${weekStart}`);
      const mockChallenges = await geminiService.generateWeeklyChallenges(user.points || 0);

      activeChallenges = [];
      for (const mc of mockChallenges) {
        const savedChallenge = await dbAdapter.insert('challenges', {
          userId,
          title: mc.title,
          description: mc.description,
          points: mc.points,
          completed: false,
          weekStartDate: weekStart
        });
        activeChallenges.push(savedChallenge);
      }
    }

    return activeChallenges;
  },

  async completeChallenge(userId, challengeId) {
    const challenge = await dbAdapter.findById('challenges', challengeId);
    if (!challenge || challenge.userId !== userId) {
      return { status: 404, error: 'Challenge not found' };
    }

    if (challenge.completed) {
      return { status: 400, error: 'Challenge is already completed' };
    }

    // Complete the challenge
    const updatedChallenge = await dbAdapter.update('challenges', challengeId, {
      completed: true,
      dateCompleted: new Date().toISOString()
    });

    // Award user points using findOne for mock compatibility
    const user = await dbAdapter.findOne(
      'users',
      u => u.id === userId,
      query => query.doc(userId)
    );
    if (user) {
      const currentPoints = user.points || 0;
      await dbAdapter.update('users', userId, { points: currentPoints + challenge.points });
    }

    // Trigger badge evaluation checks using imported badgeController to keep test mocks valid
    await badgeController.evaluateFootprintBadges(userId);

    return { status: 200, data: updatedChallenge };
  }
};

module.exports = challengeService;
