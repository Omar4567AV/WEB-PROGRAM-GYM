import { useState, useEffect } from 'react';
import { Program } from '../types/workout.types';
import { workoutService } from '../services/workoutService';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing a client's workout program
 * @param {string} clientId - ID of the client whose workout to manage
 */
export const useWorkout = (clientId?: string) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      if (clientId) {
        setIsLoading(true);
        try {
          const data = await workoutService.getActiveProgram(clientId);
          setProgram(data);
        } catch (error) {
          console.error('Failed to fetch program:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProgram();
  }, [clientId]);

  /**
   * Update the current program
   */
  const updateProgram = async (updatedProgram: Program) => {
    try {
      setIsLoading(true);
      const result = await workoutService.saveProgram(updatedProgram);
      setProgram(result);
      toast.success('Program updated successfully');
    } catch (error) {
      toast.error('Failed to update program');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    program,
    isLoading,
    updateProgram,
  };
};

export default useWorkout;
