const GeminiClient = require('./GeminiClient');
const GeminiSimulationService = require('./GeminiSimulationService');

/**
 * High-level Gemini Advice Service.
 * Leverages GeminiClient if credentials exist, otherwise falls back to GeminiSimulationService.
 */
const GeminiAdviceService = {
  async getCarbonAdvice(inputs, breakdown, total) {
    if (GeminiClient.isConfigured()) {
      try {
        return await GeminiClient.getCarbonAdvice(inputs, breakdown, total);
      } catch (error) {
        console.error('Error calling Gemini API for advice, falling back to simulation:', error);
      }
    }
    return GeminiSimulationService.getCarbonAdvice(inputs, breakdown, total);
  },

  async generateWeeklyChallenges(userScore = 0) {
    if (GeminiClient.isConfigured()) {
      try {
        return await GeminiClient.generateWeeklyChallenges(userScore);
      } catch (error) {
        console.error('Error calling Gemini API for challenges, falling back to simulation:', error);
      }
    }
    return GeminiSimulationService.generateWeeklyChallenges();
  },

  async analyzeReceipt(buffer, mimeType) {
    if (GeminiClient.isConfigured()) {
      try {
        return await GeminiClient.analyzeReceipt(buffer, mimeType);
      } catch (error) {
        console.error('Error calling Gemini Vision API, falling back to simulation:', error);
      }
    }
    return GeminiSimulationService.analyzeReceipt(mimeType);
  }
};

module.exports = GeminiAdviceService;
