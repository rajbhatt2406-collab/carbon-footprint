const { GoogleGenerativeAI } = require('@google/generative-ai');
const promptTemplates = require('../utils/promptTemplates');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('Gemini API Service initialized with credentials.');
  } catch (err) {
    console.warn('Failed to initialize Gemini API Client SDK:', err.message);
  }
}

const GeminiClient = {
  isConfigured() {
    return !!genAI;
  },

  async getCarbonAdvice(inputs, breakdown, total) {
    if (!genAI) throw new Error('Gemini API is not initialized');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = promptTemplates.getCarbonAdvicePrompt(inputs, breakdown, total);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },

  async generateWeeklyChallenges(userScore = 0) {
    if (!genAI) throw new Error('Gemini API is not initialized');
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = promptTemplates.getWeeklyChallengesPrompt(userScore);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    if (text.startsWith('```json')) text = text.substring(7);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);

    return JSON.parse(text);
  },

  async analyzeReceipt(buffer, mimeType) {
    if (!genAI) throw new Error('Gemini API is not initialized');
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = promptTemplates.getReceiptAnalysisPrompt();
    const imageParts = [
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text().trim();

    if (text.startsWith('```json')) text = text.substring(7);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);

    return JSON.parse(text);
  }
};

module.exports = GeminiClient;
