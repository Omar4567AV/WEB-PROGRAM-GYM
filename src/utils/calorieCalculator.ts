import { CalorieResult, Macros } from '../types/calories.types';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

/**
 * Calculates calorie and macro targets using Mifflin-St Jeor formula
 */
export const calculateCalories = (
  age: number,
  gender: Gender,
  height: number, // cm
  weight: number, // kg
  activity: ActivityLevel,
  _goal: 'fat-loss' | 'maintenance' | 'muscle-gain'
): CalorieResult => {
  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  // 2. Activity Multipliers
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9,
  };

  const tdee = Math.round(bmr * activityMultipliers[activity]);

  // 3. Define Calorie Targets
  const maintenance = tdee;
  const fatLoss = tdee - 500;
  const muscleGain = tdee + 300;

  // 4. Macro Calculation Helper (Simplified)
  // Protein: 2g per kg
  // Fats: 25% of total calories (9 cals per gram)
  // Carbs: Remainder (4 cals per gram)
  const calculateMacrosForCals = (cals: number): Macros => {
    const proteinGrams = Math.round(weight * 2);
    const fatGrams = Math.round((cals * 0.25) / 9);
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const carbGrams = Math.round((cals - proteinCals - fatCals) / 4);

    return {
      protein: proteinGrams,
      fats: fatGrams,
      carbs: carbGrams,
    };
  };

  // 5. BMI Calculation
  const bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));

  // 6. Water liters (35ml per kg)
  const waterLiters = Number(((weight * 35) / 1000).toFixed(1));

  return {
    maintenance,
    fatLoss,
    muscleGain,
    macros: {
      maintenance: calculateMacrosForCals(maintenance),
      fatLoss: calculateMacrosForCals(fatLoss),
      muscleGain: calculateMacrosForCals(muscleGain),
    },
    bmi,
    waterLiters,
  };
};

export default calculateCalories;
