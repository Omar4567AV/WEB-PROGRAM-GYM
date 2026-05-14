/**
 * Body measurements for progress tracking
 */
export interface Measurements {
  weight: number; // kg
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  biceps?: number; // cm
  thighs?: number; // cm
}

/**
 * Weekly check-in entry for a client
 */
export interface WeeklyEntry {
  id: string;
  clientId: string;
  date: string;
  weekNumber: number;
  measurements: Measurements;
  mood: 'great' | 'good' | 'average' | 'low' | 'bad';
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  notes?: string;
}

/**
 * Progress photo entry
 */
export interface ProgressPhoto {
  id: string;
  clientId: string;
  date: string;
  imageUrl: string;
  type: 'front' | 'side' | 'back';
  weightAtTime?: number;
}

export default WeeklyEntry;
