const dbAdapter = require('../adapters/dbAdapter');
const badgeController = require('../controllers/badgeController');

const goalService = {
  async createGoal(userId, targetValue, endDate) {
    const goalData = {
      userId,
      targetValue: Number(targetValue),
      currentProgress: 0,
      startDate: new Date().toISOString(),
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    };

    return dbAdapter.insert('goals', goalData);
  },

  async getGoalsForUser(userId) {
    const goals = await dbAdapter.find(
      'goals',
      g => g.userId === userId,
      query => query.where('userId', '==', userId).orderBy('startDate', 'desc')
    );
    goals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    return goals;
  },

  async updateGoalProgress(userId, goalId, currentProgress) {
    const goal = await dbAdapter.findById('goals', goalId);
    if (!goal || goal.userId !== userId) {
      return null;
    }

    const isCompletedNow = Number(currentProgress) >= goal.targetValue;
    const updates = {
      currentProgress: Number(currentProgress),
      completed: isCompletedNow
    };

    const updatedGoal = await dbAdapter.update('goals', goalId, updates);

    // Trigger badge evaluation checks via badgeController to keep test mocks valid
    await badgeController.evaluateFootprintBadges(userId);

    return updatedGoal;
  }
};

module.exports = goalService;
