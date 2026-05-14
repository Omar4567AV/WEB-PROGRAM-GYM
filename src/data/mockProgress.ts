import { WeeklyEntry } from '../types/progress.types';

// Helper to generate dates for mock data
const getDateOffset = (weeksAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - (weeksAgo * 7));
  return date.toISOString().split('T')[0];
};

export const mockProgress: WeeklyEntry[] = [
  // Client 1 Progress (Muscle Gain)
  ...[8, 7, 6, 5, 4, 3, 2, 1].map((week, index) => ({
    id: `entry-1-${week}`,
    clientId: 'client-1',
    date: getDateOffset(8 - index),
    weekNumber: index + 1,
    measurements: {
      weight: 85 + (index * 0.2), // Slow weight gain
      chest: 100 + (index * 0.1),
      waist: 82,
      hips: 95,
      biceps: 38 + (index * 0.05),
    },
    mood: (['good', 'great', 'good', 'average', 'great', 'good', 'great', 'great'] as any)[index],
    energyLevel: 8,
    sleepQuality: 7 + (index % 2),
    notes: index === 0 ? 'Starting the program!' : 'Feeling stronger each week.',
  })),

  // Client 2 Progress (Fat Loss)
  ...[8, 7, 6, 5, 4, 3, 2, 1].map((week, index) => ({
    id: `entry-2-${week}`,
    clientId: 'client-2',
    date: getDateOffset(8 - index),
    weekNumber: index + 1,
    measurements: {
      weight: 65 - (index * 0.4), // consistent weight loss
      chest: 90,
      waist: 75 - (index * 0.3),
      hips: 100 - (index * 0.2),
    },
    mood: (['average', 'good', 'low', 'good', 'great', 'good', 'average', 'good'] as any)[index],
    energyLevel: 7,
    sleepQuality: 8,
    notes: index === 2 ? 'Hard week, but stayed on track.' : 'Scale is moving down!',
  })),
];

export default mockProgress;
