const footprintService = require('../services/footprintService');

const footprintController = {
  /**
   * Calculates carbon footprint, requests Gemini advice, and saves the log
   */
  async create(req, res) {
    try {
      const { uid } = req.user;
      const { carKm, bikeKm, busKm, trainKm, electricityKwh, foodHabit, shoppingHabit } = req.body;

      // Validate inputs
      if (foodHabit === undefined || shoppingHabit === undefined) {
        return res.status(400).json({ error: 'Food habits and shopping habits are required fields' });
      }

      const inputs = { carKm, bikeKm, busKm, trainKm, electricityKwh, foodHabit, shoppingHabit };
      const savedRecord = await footprintService.createFootprintLog(uid, inputs);

      res.status(201).json(savedRecord);
    } catch (error) {
      console.error('Create footprint log error:', error);
      res.status(500).json({ error: 'Failed to record carbon footprint' });
    }
  },

  /**
   * Fetches all carbon calculation logs for the user
   */
  async getHistory(req, res) {
    try {
      const { uid } = req.user;
      const logs = await footprintService.getFootprintHistory(uid);
      res.json(logs);
    } catch (error) {
      console.error('Get footprint history error:', error);
      res.status(500).json({ error: 'Failed to retrieve history' });
    }
  },

  /**
   * Calculates dashboard summary (latest, previous, difference)
   */
  async getSummary(req, res) {
    try {
      const { uid } = req.user;
      const summary = await footprintService.getFootprintSummary(uid);
      res.json(summary);
    } catch (error) {
      console.error('Get summary stats error:', error);
      res.status(500).json({ error: 'Failed to calculate carbon summary statistics' });
    }
  }
};

module.exports = footprintController;
