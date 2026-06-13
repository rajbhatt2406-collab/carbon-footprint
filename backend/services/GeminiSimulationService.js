/**
 * GeminiSimulationService containing mock data heuristics.
 * Serves as fallback handler when Gemini API credentials are absent or fail.
 */
const GeminiSimulationService = {
  getCarbonAdvice(inputs, breakdown, total) {
    const highestSource = Object.keys(breakdown).reduce((a, b) => breakdown[a] > breakdown[b] ? a : b);
    
    let advice = `### EcoLens AI Simulated Analysis 🌍\n\n`;
    advice += `Based on your monthly carbon footprint of **${total} kg CO₂**, your biggest contributor is **${highestSource.toUpperCase()}** (${breakdown[highestSource]} kg CO₂).\n\n`;
    
    advice += `#### 🔍 Source Breakdown:\n`;
    advice += `- 🚗 Transportation: **${breakdown.transportation} kg CO₂**\n`;
    advice += `- ⚡ Electricity: **${breakdown.electricity} kg CO₂**\n`;
    advice += `- 🥗 Diet & Food: **${breakdown.food} kg CO₂**\n`;
    advice += `- 🛍️ Shopping & Consumables: **${breakdown.shopping} kg CO₂**\n\n`;

    advice += `#### 💡 Personalized Recommendations:\n`;
    if (highestSource === 'transportation') {
      advice += `- **Car Reduction:** You drive approximately ${inputs.carKm || 0} km per week. Replacing 20% of your weekly commutes with public transport or active biking would reduce your emissions by approximately **${Math.round((inputs.carKm || 0) * 0.2 * 4.33 * 0.18)} kg CO₂** monthly.\n`;
      advice += `- **Eco-driving:** Maintain your tires inflated and drive smoothly to improve your car's fuel efficiency by 5-10%.\n`;
    } else if (highestSource === 'electricity') {
      advice += `- **Smart Appliances:** Your monthly consumption is ${inputs.electricityKwh || 0} kWh. Switching to LED bulbs and setting your thermostat 1-2 degrees lower can save up to **${Math.round((inputs.electricityKwh || 0) * 0.1 * 0.5)} kg CO₂** per month.\n`;
      advice += `- **Standby Draw:** Unplug devices when not in use. Standby power accounts for 5-10% of home electricity use.\n`;
    } else if (highestSource === 'food') {
      advice += `- **Diet Shift:** Transitioning some of your non-vegetarian/mixed meals to plant-based choices can cut dietary emissions by **30-50 kg CO₂** monthly. Try observing "Meatless Mondays".\n`;
      advice += `- **Reduce Waste:** Buy only what you need. Food waste in landfills accounts for significant global methane emissions.\n`;
    } else {
      advice += `- **Mindful Consumption:** Opt for second-hand purchases, repair broken items instead of replacing them, and choose products with minimal packaging to save up to **40 kg CO₂** monthly.\n`;
    }

    advice += `\n#### 🎯 Quick Wins:\n`;
    advice += `- **Switch to LED bulbs:** Saves about **5 kg CO₂** per month per room.\n`;
    advice += `- **Wash laundry in cold water:** Saves **10-15 kg CO₂** monthly by avoiding water heating.\n`;
    advice += `- **One meat-free day per week:** Saves approximately **12 kg CO₂** per month.\n`;

    return advice;
  },

  generateWeeklyChallenges() {
    return [
      {
        title: "Cold Water Wash",
        description: "Wash all your laundry loads using cold water settings to reduce hot-water energy consumption.",
        points: 15
      },
      {
        title: "Veggie Day",
        description: "Eat entirely vegetarian or vegan meals today to lower agricultural impact.",
        points: 20
      },
      {
        title: "Active Commute",
        description: "Replace at least one short car trip (< 3 km) by walking, biking, or riding transit.",
        points: 25
      }
    ];
  },

  analyzeReceipt(mimeType) {
    const isPdf = mimeType && mimeType.toLowerCase().includes('pdf');
    
    if (isPdf) {
      return {
        type: "electricity",
        unitsConsumed: 280,
        purchaseAmount: 84.50,
        productCategories: ["Home Utility", "Electricity Grid"],
        estimatedCarbonImpact: 140,
        explanation: "Simulated extraction: Detected electricity bill of 280 kWh. At an emission rate of 0.5 kg CO2/kWh, the estimated carbon impact is 140.00 kg CO2."
      };
    } else {
      return {
        type: "receipt",
        unitsConsumed: 5,
        purchaseAmount: 42.75,
        productCategories: ["Groceries", "Meat/Dairy", "Produce"],
        estimatedCarbonImpact: 18.5,
        explanation: "Simulated extraction: Detected grocery store receipt. Included beef (3.2 kg CO2), cheese (1.5 kg CO2), and fresh fruits/vegetables (0.8 kg CO2), totaling 18.50 kg CO2."
      };
    }
  }
};

module.exports = GeminiSimulationService;
