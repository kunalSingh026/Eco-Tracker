// backend/src/controllers/carbonEngine.ts

// Average CO2 emissions in kg based on standard climate metrics
const EMISSION_FACTORS = {
  transport: {
    car: 0.170,              // kg CO2 per km
    public_transport: 0.040, // kg CO2 per km
    bike: 0.0,
    walk: 0.0
  },
  meals: {
    meat_heavy: 3.0,         // kg CO2 per meal average
    vegetarian: 1.2,         // kg CO2 per meal average
    vegan: 0.7               // kg CO2 per meal average
  }
};

interface FootprintInput {
  commuteMode?: 'car' | 'public_transport' | 'bike' | 'walk';
  commuteDistanceKm?: number;
  mealType?: 'meat_heavy' | 'vegetarian' | 'vegan';
  energyKwh?: number;
}

export function calculateDailyCarbon(input: FootprintInput): number {
  let totalCo2 = 0;

  // 1. Calculate Transport Impact
  if (input.commuteMode && input.commuteDistanceKm) {
    const factor = EMISSION_FACTORS.transport[input.commuteMode] || 0;
    totalCo2 += input.commuteDistanceKm * factor;
  }

  // 2. Calculate Diet Impact
  if (input.mealType) {
    totalCo2 += EMISSION_FACTORS.meals[input.mealType] || 0;
  }

  // 3. Calculate Energy Impact (Avg global grid emission factor ~0.4 kg CO2 per kWh)
  if (input.energyKwh) {
    totalCo2 += input.energyKwh * 0.4;
  }

  // Rounding to 2 decimal places
  return Math.round(totalCo2 * 100) / 100;
}
