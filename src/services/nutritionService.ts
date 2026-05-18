import { MealEntry } from '../types/calories.types';
import { mockMeals } from '../data/mockMeals';

// In-memory mutable store — resets on page refresh (swap for API calls)
let store: MealEntry[] = [...mockMeals];

export const nutritionService = {
  getMealsByDate: async (clientId: string, date: string): Promise<MealEntry[]> => {
    await new Promise((r) => setTimeout(r, 400));
    return store.filter((m) => m.clientId === clientId && m.date === date);
  },

  createMeal: async (
    clientId: string,
    data: Omit<MealEntry, 'id' | 'clientId'>
  ): Promise<MealEntry> => {
    await new Promise((r) => setTimeout(r, 600));
    const meal: MealEntry = { ...data, id: 'meal-' + Date.now(), clientId };
    store = [meal, ...store];
    return meal;
  },

  updateMeal: async (id: string, data: Partial<Omit<MealEntry, 'id' | 'clientId'>>): Promise<MealEntry> => {
    await new Promise((r) => setTimeout(r, 600));
    const idx = store.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Meal not found');
    store[idx] = { ...store[idx], ...data };
    return store[idx];
  },

  deleteMeal: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 400));
    store = store.filter((m) => m.id !== id);
  },
};

export default nutritionService;
