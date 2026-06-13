const badgeService = require('../services/badgeService');

const badgeController = {
  /**
   * Retrieves all badges unlocked by the user
   */
  async getBadges(req, res) {
    try {
      const { uid } = req.user;
      const badgesResult = await badgeService.getBadgesForUser(uid);
      res.json(badgesResult);
    } catch (error) {
      console.error('Get badges error:', error);
      res.status(500).json({ error: 'Failed to retrieve achievements' });
    }
  },

  /**
   * Evaluates carbon logs and challenge logs to award new badges
   * Kept for backward compatibility inside controller imports
   */
  async evaluateFootprintBadges(userId) {
    return badgeService.evaluateFootprintBadges(userId);
  }
};

module.exports = badgeController;
