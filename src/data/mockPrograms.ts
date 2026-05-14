import { Program } from '../types/workout.types';

export const mockPrograms: Program[] = [
  {
    id: 'prog-1',
    clientId: 'client-1',
    coachId: 'coach-1',
    title: 'Advanced Hypertrophy - PPL',
    description: 'High volume Push-Pull-Legs program for maximum muscle growth.',
    type: 'Push Pull Legs',
    startDate: '2024-04-01',
    isActive: true,
    days: [
      {
        id: 'day-1',
        dayName: 'Monday',
        isRestDay: false,
        exercises: [
          { id: 'ex-1', name: 'Bench Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { id: 'ex-2', name: 'Overhead Press', sets: 3, reps: '10-12', restSeconds: 60 },
          { id: 'ex-3', name: 'Lateral Raises', sets: 4, reps: '15', restSeconds: 45 },
        ],
      },
      {
        id: 'day-2',
        dayName: 'Tuesday',
        isRestDay: false,
        exercises: [
          { id: 'ex-4', name: 'Pull Ups', sets: 4, reps: 'To failure', restSeconds: 90 },
          { id: 'ex-5', name: 'Barbell Rows', sets: 3, reps: '8-10', restSeconds: 60 },
          { id: 'ex-6', name: 'Face Pulls', sets: 3, reps: '15', restSeconds: 45 },
        ],
      },
      { id: 'day-3', dayName: 'Wednesday', isRestDay: true, exercises: [] },
    ],
  },
  {
    id: 'prog-2',
    clientId: 'client-2',
    coachId: 'coach-1',
    title: 'Kickstart Fat Loss',
    description: 'Metabolic conditioning and full body strength training.',
    type: 'Fat Loss',
    startDate: '2024-04-05',
    isActive: true,
    days: [
      {
        id: 'day-1',
        dayName: 'Monday',
        isRestDay: false,
        exercises: [
          { id: 'ex-7', name: 'Goblet Squats', sets: 3, reps: '15', restSeconds: 60 },
          { id: 'ex-8', name: 'Dumbbell Press', sets: 3, reps: '12', restSeconds: 60 },
          { id: 'ex-9', name: 'Plank', sets: 3, reps: '60s', restSeconds: 30 },
        ],
      },
      { id: 'day-2', dayName: 'Tuesday', isRestDay: true, exercises: [] },
    ],
  },
  {
    id: 'prog-3',
    clientId: 'client-3',
    coachId: 'coach-1',
    title: 'Foundational Strength',
    description: 'Building a solid base with compound movements.',
    type: 'Full Body',
    startDate: '2024-03-15',
    isActive: true,
    days: [
      {
        id: 'day-1',
        dayName: 'Monday',
        isRestDay: false,
        exercises: [
          { id: 'ex-10', name: 'Deadlift', sets: 3, reps: '5', restSeconds: 120 },
          { id: 'ex-11', name: 'Leg Press', sets: 3, reps: '10', restSeconds: 90 },
        ],
      },
    ],
  },
];

export default mockPrograms;
