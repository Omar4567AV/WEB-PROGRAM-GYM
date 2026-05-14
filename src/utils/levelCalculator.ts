/**
 * Determines training level based on total months of consistent training
 */
export const calculateTrainingLevel = (months: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (months < 12) {
    return 'beginner';
  }
  if (months < 36) {
    return 'intermediate';
  }
  return 'advanced';
};

/**
 * Returns a human-readable string for the training level
 */
export const formatTrainingLevel = (level: string): string => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};

export default calculateTrainingLevel;
