import { WeeklyEntry } from '../types/progress.types';
import { mockProgress } from '../data/mockProgress';

/**
 * Service for tracking client progress and weekly check-ins.
 */
export const progressService = {
  /**
   * Fetch all progress entries for a specific client
   */
  getProgressByClientId: async (clientId: string): Promise<WeeklyEntry[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockProgress
      .filter((p) => p.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Fetch the most recent entry for a client
   */
  getLatestEntry: async (clientId: string): Promise<WeeklyEntry | null> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const clientProgress = mockProgress.filter((p) => p.clientId === clientId);
    if (clientProgress.length === 0) return null;
    
    return clientProgress.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  },

  /**
   * Submit a new weekly check-in
   */
  addEntry: async (entry: Omit<WeeklyEntry, 'id'>): Promise<WeeklyEntry> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newEntry: WeeklyEntry = {
      ...entry,
      id: 'entry-' + Date.now(),
    };
    // In a real app, we would push to DB
    return newEntry;
  },
};

export default progressService;
