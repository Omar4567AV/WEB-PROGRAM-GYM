import { Program } from '../types/workout.types';
import { mockPrograms } from '../data/mockPrograms';

const PROGRAMS_KEY = 'coach_pro_programs';

const getStoredPrograms = (): Program[] => {
  const stored = localStorage.getItem(PROGRAMS_KEY);
  if (!stored) {
    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(mockPrograms));
    return mockPrograms;
  }
  return JSON.parse(stored);
};

/**
 * Service for managing workout programs and exercises.
 */
export const workoutService = {
  /**
   * Fetch the active program for a client
   */
  getActiveProgram: async (clientId: string): Promise<Program | null> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const program = getStoredPrograms().find((p) => p.clientId === clientId && p.isActive);
    return program || null;
  },

  /**
   * Fetch all programs for a client (history)
   */
  getProgramHistory: async (clientId: string): Promise<Program[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getStoredPrograms().filter((p) => p.clientId === clientId);
  },

  /**
   * Save or update a program
   */
  saveProgram: async (program: Program): Promise<Program> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const programs = getStoredPrograms();
    const index = programs.findIndex((p) => p.id === program.id);
    
    if (index > -1) {
      programs[index] = program;
    } else {
      programs.push(program);
    }
    
    // Ensure only one is active at a time for this client
    if (program.isActive) {
      programs.forEach((p) => {
        if (p.clientId === program.clientId && p.id !== program.id) {
          p.isActive = false;
        }
      });
    }

    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
    return program;
  },

  /**
   * Delete a program
   */
  deleteProgram: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const programs = getStoredPrograms();
    const filtered = programs.filter((p) => p.id !== id);
    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(filtered));
    return true;
  },
};

export default workoutService;
