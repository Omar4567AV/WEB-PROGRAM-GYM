/**
 * Individual macro breakdown
 */
export interface Macros {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
}

/**
 * Calculated calorie targets for different goals
 */
export interface CalorieResult {
  maintenance: number;
  fatLoss: number;
  muscleGain: number;
  macros: {
    maintenance: Macros;
    fatLoss: Macros;
    muscleGain: Macros;
  };
  bmi: number;
  waterLiters: number;
}

/**
 * Target macros and calories assigned to a client
 */
export interface MacroTargets extends Macros {
  calories: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Daily meal tracking entry
 */
export interface MealEntry {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  photoUrl?: string;
  notes?: string;
}

export default CalorieResult;
