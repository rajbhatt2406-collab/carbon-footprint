export interface FootprintInputs {
  carKm: number;
  bikeKm: number;
  busKm: number;
  trainKm: number;
  electricityKwh: number;
  foodHabit: string;
  shoppingHabit: string;
}

export interface FootprintBreakdown {
  transportation: number;
  electricity: number;
  food: number;
  shopping: number;
}

export interface Footprint {
  id: string;
  userId: string;
  createdAt: string;
  date: string;
  inputs: FootprintInputs;
  breakdown: FootprintBreakdown;
  total: number;
  advice: string;
}

export interface FootprintSummary {
  current: Footprint | null;
  previous: Footprint | null;
  difference: {
    total: number;
    percentage: number;
    breakdown: {
      transportation: number;
      electricity: number;
      food: number;
      shopping: number;
    };
  } | null;
}
