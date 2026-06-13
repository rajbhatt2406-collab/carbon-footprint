const challengeService = require('../services/challengeService');

const challengeController = {
  /**
   * Retrieves the current week's challenges. If none exist, generates them.
   */
  async getWeekly(req, res) {
    try {
      const { uid } = req.user;
      const challenges = await challengeService.getWeeklyChallenges(uid);
      res.json(challenges);
    } catch (error) {
      console.error('Get weekly challenges error:', error);
      res.status(500).json({ error: 'Failed to retrieve weekly challenges' });
    }
  },

  /**
   * Marks a challenge as completed and awards points to the user
   */
  async complete(req, res) {
    try {
      const { uid } = req.user;
      const { id } = req.params;

      const result = await challengeService.completeChallenge(uid, id);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Complete challenge error:', error);
      res.status(500).json({ error: 'Failed to complete challenge' });
    }
  }
};

module.exports = challengeController;
