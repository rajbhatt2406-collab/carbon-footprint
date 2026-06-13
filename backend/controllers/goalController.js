const goalService = require('../services/goalService');

const goalController = {
  /**
   * Creates a new carbon reduction goal
   */
  async create(req, res) {
    try {
      const { uid } = req.user;
      const { targetValue, endDate } = req.body;

      if (!targetValue || Number(targetValue) <= 0) {
        return res.status(400).json({ error: 'Target reduction value must be greater than zero' });
      }

      const savedGoal = await goalService.createGoal(uid, targetValue, endDate);
      res.status(201).json(savedGoal);
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: 'Failed to create monthly carbon goal' });
    }
  },

  /**
   * Retrieves all goals of a user
   */
  async getGoals(req, res) {
    try {
      const { uid } = req.user;
      const goals = await goalService.getGoalsForUser(uid);
      res.json(goals);
    } catch (error) {
      console.error('Get goals list error:', error);
      res.status(500).json({ error: 'Failed to retrieve goals' });
    }
  },

  /**
   * Updates progress on an active goal
   */
  async updateProgress(req, res) {
    try {
      const { uid } = req.user;
      const { id } = req.params;
      const { currentProgress } = req.body;

      if (currentProgress === undefined || Number(currentProgress) < 0) {
        return res.status(400).json({ error: 'Progress value must be non-negative' });
      }

      const updatedGoal = await goalService.updateGoalProgress(uid, id, currentProgress);
      if (!updatedGoal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      return res.json(updatedGoal);
    } catch (error) {
      console.error('Update goal progress error:', error);
      res.status(500).json({ error: 'Failed to update goal progress' });
    }
  }
};

module.exports = goalController;
