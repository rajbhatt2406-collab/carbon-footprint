export interface EmissionFactors {
    transportation: {
        car: number;
        bike: number;
        bus: number;
        train: number;
    };
    electricity: {
        kwh: number;
    };
    food: Record<string, number>;
    shopping: Record<string, number>;
}
export declare const EMISSION_FACTORS: EmissionFactors;
export interface CalculateFootprintInputs {
    carKm?: string | number;
    bikeKm?: string | number;
    busKm?: string | number;
    trainKm?: string | number;
    electricityKwh?: string | number;
    foodHabit?: string;
    shoppingHabit?: string;
}
export interface CalculateFootprintResult {
    total: number;
    breakdown: {
        transportation: number;
        electricity: number;
        food: number;
        shopping: number;
    };
}
/**
 * Calculates carbon footprint based on weekly inputs and monthly habits.
 */
export declare function calculateFootprint(inputs: CalculateFootprintInputs): CalculateFootprintResult;
