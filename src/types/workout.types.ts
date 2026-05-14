/**
 * Types of training programs
 */
export type ProgramType = 'Full Body' | 'Push Pull Legs' | 'Upper Lower' | 'Fat Loss' | 'Muscle Gain';

/**
 * Single exercise definition with sets and targets
 */
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // string to allow "8-12" or "To failure"
  restSeconds: number;
  notes?: string;
  videoUrl?: string;
}

/**
 * A single day in a workout week
 */
export interface WorkoutDay {
  id: string;
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isRestDay: boolean;
  exercises: Exercise[];
}

/**
 * Full workout program assigned to a client
 */
export interface Program {
  id: string;
  clientId: string;
  coachId: string;
  title: string;
  description: string;
  type: ProgramType;
  startDate: string;
  endDate?: string;
  days: WorkoutDay[];
  isActive: boolean;
}

export default Program;
