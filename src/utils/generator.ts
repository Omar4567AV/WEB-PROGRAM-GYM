import { ClientProfile } from '../types/user.types';
import { Program, ProgramType, WorkoutDay, Exercise } from '../types/workout.types';

export interface GeneratedPlan {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  workoutProgram: Omit<Program, 'id' | 'clientId' | 'coachId' | 'startDate' | 'isActive'> & {
    title: string;
    description: string;
    type: ProgramType;
    days: WorkoutDay[];
  };
}

/**
 * Calculates BMR using Mifflin-St Jeor Equation
 */
const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Maps activity level string to numeric multiplier
 */
const getActivityMultiplier = (level: ClientProfile['activityLevel']): number => {
  switch (level) {
    case 'sedentary': return 1.2;
    case 'light': return 1.375;
    case 'moderate': return 1.55;
    case 'active': return 1.725;
    case 'very-active': return 1.9;
    default: return 1.55; // default to moderate
  }
};

/**
 * Generates an optimized diet plan and workout schedule based on client details.
 */
export const generatePlanForClient = (client: Partial<ClientProfile>): GeneratedPlan => {
  const weight = client.weight || 80;
  const height = client.height || 175;
  const age = client.age || 25;
  const gender = client.gender || 'male';
  const goal = client.goal || 'maintenance';
  const activityLevel = client.activityLevel || 'moderate';
  const trainingLevel = client.trainingLevel || 'intermediate';

  // 1. NUTRITION CALCULATION
  const bmr = calculateBMR(weight, height, age, gender);
  const multiplier = getActivityMultiplier(activityLevel);
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (goal === 'fat-loss') {
    targetCalories = Math.max(gender === 'female' ? 1200 : 1500, tdee - 500);
  } else if (goal === 'muscle-gain') {
    targetCalories = tdee + 300;
  }

  // Calculate Macros
  // Protein: Beginner: 1.8g/kg, Intermediate: 2.0g/kg, Advanced: 2.2g/kg
  let proteinPerKg = 2.0;
  if (trainingLevel === 'beginner') proteinPerKg = 1.8;
  if (trainingLevel === 'advanced') proteinPerKg = 2.2;
  
  const targetProtein = Math.round(weight * proteinPerKg);
  
  // Fats: 25% of calories
  const fatCalories = targetCalories * 0.25;
  const targetFats = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const remainingCalories = targetCalories - (targetProtein * 4) - (targetFats * 9);
  const targetCarbs = Math.max(50, Math.round(remainingCalories / 4));

  // 2. FITNESS PROGRAM GENERATION
  let programTitle = '';
  let programDescription = '';
  let programType: ProgramType = 'Full Body';
  let days: WorkoutDay[] = [];

  const exerciseId = () => `ex-gen-${Math.random().toString(36).substr(2, 9)}`;
  const dayId = () => `day-gen-${Math.random().toString(36).substr(2, 9)}`;

  if (trainingLevel === 'beginner' || goal === 'fat-loss') {
    // 3-Day Full Body Plan
    programTitle = `Beginner Foundational Full-Body`;
    programDescription = `3-day full body training designed to build strength, improve coordination, and maximize metabolic rate for ${goal.replace('-', ' ')}.`;
    programType = 'Full Body';

    days = [
      {
        id: dayId(),
        dayName: 'Monday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Goblet Squats', sets: 3, reps: '10-12', restSeconds: 90 },
          { id: exerciseId(), name: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 60 },
          { id: exerciseId(), name: 'Lat Pulldowns', sets: 3, reps: '12', restSeconds: 60 },
          { id: exerciseId(), name: 'Romanian Deadlifts (DB)', sets: 3, reps: '12', restSeconds: 75 },
          { id: exerciseId(), name: 'Plank Hold', sets: 3, reps: '45-60s', restSeconds: 45 }
        ]
      },
      { id: dayId(), dayName: 'Tuesday', isRestDay: true, exercises: [] },
      {
        id: dayId(),
        dayName: 'Wednesday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Leg Press', sets: 3, reps: '12-15', restSeconds: 90 },
          { id: exerciseId(), name: 'Seated Cable Rows', sets: 3, reps: '10-12', restSeconds: 60 },
          { id: exerciseId(), name: 'Incline DB Press', sets: 3, reps: '10-12', restSeconds: 75 },
          { id: exerciseId(), name: 'Lying Leg Curls', sets: 3, reps: '12', restSeconds: 60 },
          { id: exerciseId(), name: 'Hanging Knee Raises', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      { id: dayId(), dayName: 'Thursday', isRestDay: true, exercises: [] },
      {
        id: dayId(),
        dayName: 'Friday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Dumbbell Lunge Split Squats', sets: 3, reps: '10 each', restSeconds: 90 },
          { id: exerciseId(), name: 'Overhead Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 75 },
          { id: exerciseId(), name: 'Face Pulls', sets: 3, reps: '15', restSeconds: 45 },
          { id: exerciseId(), name: 'Kettlebell Swings', sets: 3, reps: '15-20', restSeconds: 60 },
          { id: exerciseId(), name: 'Abdominal Crunches', sets: 3, reps: '20', restSeconds: 45 }
        ]
      },
      { id: dayId(), dayName: 'Saturday', isRestDay: true, exercises: [] },
      { id: dayId(), dayName: 'Sunday', isRestDay: true, exercises: [] }
    ];
  } else if (trainingLevel === 'intermediate') {
    // 4-Day Upper Lower Split
    programTitle = `Intermediate Upper-Lower Hypertrophy`;
    programDescription = `High frequency 4-day split focus on muscle progression, target recovery periods, and balanced loading.`;
    programType = 'Upper Lower';

    days = [
      {
        id: dayId(),
        dayName: 'Monday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Flat Barbell Bench Press', sets: 4, reps: '6-8', restSeconds: 120 },
          { id: exerciseId(), name: 'Barbell Bent Over Rows', sets: 4, reps: '8-10', restSeconds: 90 },
          { id: exerciseId(), name: 'Seated DB Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { id: exerciseId(), name: 'Lat Pulldowns (Wide)', sets: 3, reps: '10-12', restSeconds: 75 },
          { id: exerciseId(), name: 'Incline DB Chest Flyes', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        id: dayId(),
        dayName: 'Tuesday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Barbell Back Squats', sets: 4, reps: '6-8', restSeconds: 120 },
          { id: exerciseId(), name: 'Romanian Deadlifts', sets: 4, reps: '8-10', restSeconds: 90 },
          { id: exerciseId(), name: 'Leg Extensions', sets: 3, reps: '12-15', restSeconds: 60 },
          { id: exerciseId(), name: 'Seated Hamstring Curls', sets: 3, reps: '12-15', restSeconds: 60 },
          { id: exerciseId(), name: 'Standing Calf Raises', sets: 4, reps: '15', restSeconds: 45 }
        ]
      },
      { id: dayId(), dayName: 'Wednesday', isRestDay: true, exercises: [] },
      {
        id: dayId(),
        dayName: 'Thursday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 120 },
          { id: exerciseId(), name: 'Weighted Chin-Ups', sets: 4, reps: '8', restSeconds: 90 },
          { id: exerciseId(), name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', restSeconds: 45 },
          { id: exerciseId(), name: 'Cable Crossover Press', sets: 3, reps: '12', restSeconds: 60 },
          { id: exerciseId(), name: 'Barbell Bicep Curls', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        id: dayId(),
        dayName: 'Friday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Barbell Sumo Deadlifts', sets: 3, reps: '5', restSeconds: 120 },
          { id: exerciseId(), name: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { id: exerciseId(), name: 'Bulgarian Split Squats', sets: 3, reps: '10 each', restSeconds: 75 },
          { id: exerciseId(), name: 'Hanging Leg Raises', sets: 3, reps: '15', restSeconds: 60 },
          { id: exerciseId(), name: 'Cable Rope Crunch', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      { id: dayId(), dayName: 'Saturday', isRestDay: true, exercises: [] },
      { id: dayId(), dayName: 'Sunday', isRestDay: true, exercises: [] }
    ];
  } else {
    // Advanced: Push Pull Legs (PPL) Split
    programTitle = `Advanced Elite PPL Power Split`;
    programDescription = `Highly demanding, high volume 5-day cycle split optimized for extreme muscle hypertrophy, power, and metabolic conditioning.`;
    programType = 'Push Pull Legs';

    days = [
      {
        id: dayId(),
        dayName: 'Monday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Incline DB Bench Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { id: exerciseId(), name: 'Overhead Military Press', sets: 4, reps: '6-8', restSeconds: 120 },
          { id: exerciseId(), name: 'Weighted Chest Dips', sets: 3, reps: '10', restSeconds: 75 },
          { id: exerciseId(), name: 'Cable Lateral Raises', sets: 4, reps: '12-15', restSeconds: 45 },
          { id: exerciseId(), name: 'Overhead Cable Triceps Extensions', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        id: dayId(),
        dayName: 'Tuesday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Barbell Conventional Deadlift', sets: 4, reps: '5', restSeconds: 150 },
          { id: exerciseId(), name: 'Meadows Rows', sets: 4, reps: '8-10', restSeconds: 90 },
          { id: exerciseId(), name: 'Lat Pulldowns (Underhand)', sets: 3, reps: '10-12', restSeconds: 75 },
          { id: exerciseId(), name: 'Chest Supported DB Rows', sets: 3, reps: '12', restSeconds: 60 },
          { id: exerciseId(), name: 'Incline DB Hammer Curls', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        id: dayId(),
        dayName: 'Wednesday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Barbell Back Squats (Low Bar)', sets: 4, reps: '6', restSeconds: 150 },
          { id: exerciseId(), name: 'Romanian Deadlifts (Barbell)', sets: 4, reps: '8', restSeconds: 120 },
          { id: exerciseId(), name: 'Hack Squats', sets: 3, reps: '10-12', restSeconds: 90 },
          { id: exerciseId(), name: 'Lying Leg Hamstring Curls', sets: 3, reps: '12', restSeconds: 60 },
          { id: exerciseId(), name: 'Standing Calf Raises', sets: 4, reps: '12-15', restSeconds: 45 }
        ]
      },
      { id: dayId(), dayName: 'Thursday', isRestDay: true, exercises: [] },
      {
        id: dayId(),
        dayName: 'Friday',
        isRestDay: false,
        exercises: [
          { id: exerciseId(), name: 'Flat Barbell Bench Press', sets: 4, reps: '6', restSeconds: 120 },
          { id: exerciseId(), name: 'Weighted Pull-Ups', sets: 4, reps: '6', restSeconds: 120 },
          { id: exerciseId(), name: 'Seated DB Arnold Press', sets: 3, reps: '10', restSeconds: 90 },
          { id: exerciseId(), name: 'Incline DB Hammer Curls', sets: 3, reps: '12', restSeconds: 60 },
          { id: exerciseId(), name: 'Cable Pushdowns (V-Bar)', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      { id: dayId(), dayName: 'Saturday', isRestDay: true, exercises: [] },
      { id: dayId(), dayName: 'Sunday', isRestDay: true, exercises: [] }
    ];
  }

  return {
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFats,
    workoutProgram: {
      title: programTitle,
      description: programDescription,
      type: programType,
      days
    }
  };
};
