import { Program } from '../types/workout.types';
import { mockPrograms } from '../data/mockPrograms';

/**
 * Service for managing workout programs and exercises.
 */
export const workoutService = {
  /**
   * Fetch the active program for a client
   */
  getActiveProgram: async (clientId: string): Promise<Program | null> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const program = mockPrograms.find((p) => p.clientId === clientId && p.isActive);
    return program || null;
  },

  /**
   * Fetch all programs for a client (history)
   */
  getProgramHistory: async (clientId: string): Promise<Program[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPrograms.filter((p) => p.clientId === clientId);
  },

  /**
   * Save or update a program
   */
  saveProgram: async (program: Program): Promise<Program> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mocking update/create
    return program;
  },

  /**
   * Delete a program
   */
  deleteProgram: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },
};

export default workoutService;
