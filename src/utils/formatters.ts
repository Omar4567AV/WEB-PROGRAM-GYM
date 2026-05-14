/**
 * Formats a date string into a readable format (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats weight value with "kg" suffix
 */
export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)} kg`;
};

/**
 * Formats measurement value with "cm" suffix
 */
export const formatCm = (value: number): string => {
  return `${value.toFixed(1)} cm`;
};

/**
 * Formats calorie value with "kcal" suffix
 */
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)} kcal`;
};

/**
 * Formats percentage for UI display
 */
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`;
};

export default {
  formatDate,
  formatWeight,
  formatCm,
  formatCalories,
  formatPercent,
};
