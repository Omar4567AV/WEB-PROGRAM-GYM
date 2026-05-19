import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { clientService } from '../../services/clientService';
import { generatePlanForClient } from '../../utils/generator';
import { ClientProfile } from '../../types/user.types';
import { Button, Badge } from '../../components/ui';
import {
  Zap, Target, Flame, Droplets, Apple, Coffee, Sun, Moon,
  ChevronDown, ChevronUp, ShieldCheck, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────

interface GeneratedMeal {
  time: string;
  label: string;
  items: { name: string; calories: number; protein: number; carbs: number; fats: number }[];
  icon: React.ReactNode;
  color: string;
  bg: string;
}

// ── Meal template builder ─────────────────────────────────────────────────────

const buildMealPlan = (
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  goal: string
): GeneratedMeal[] => {
  const isLoss = goal === 'fat-loss';
  const isGain = goal === 'muscle-gain';

  const breakfastCals = Math.round(calories * 0.25);
  const lunchCals     = Math.round(calories * 0.35);
  const dinnerCals    = Math.round(calories * 0.30);
  const snackCals     = Math.round(calories * 0.10);

  return [
    {
      time: '07:00 AM',
      label: 'Breakfast',
      icon: <Coffee className="w-5 h-5" />,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      items: isLoss
        ? [
            { name: 'Egg White Omelette (4 whites)', calories: 68, protein: 14, carbs: 1, fats: 1 },
            { name: 'Whole grain toast (1 slice)', calories: 80, protein: 4, carbs: 15, fats: 1 },
            { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 4, fats: 1 },
            { name: `Mixed Berries (100g)`, calories: Math.max(30, breakfastCals - 207), protein: 1, carbs: 10, fats: 0 },
          ]
        : isGain
        ? [
            { name: 'Whole Eggs (3)', calories: 210, protein: 18, carbs: 2, fats: 15 },
            { name: 'Oatmeal with Milk (200g)', calories: 200, protein: 8, carbs: 35, fats: 4 },
            { name: 'Banana (1 large)', calories: 105, protein: 1, carbs: 27, fats: 0 },
            { name: 'Whey Protein Shake', calories: Math.max(50, breakfastCals - 515), protein: 25, carbs: 5, fats: 2 },
          ]
        : [
            { name: 'Scrambled Eggs (3)', calories: 210, protein: 18, carbs: 2, fats: 14 },
            { name: 'Avocado Toast (1 slice)', calories: 160, protein: 4, carbs: 15, fats: 9 },
            { name: 'Orange Juice (200ml)', calories: 88, protein: 1, carbs: 21, fats: 0 },
            { name: 'Black Coffee / Green Tea', calories: Math.max(5, breakfastCals - 458), protein: 0, carbs: 0, fats: 0 },
          ],
    },
    {
      time: '12:30 PM',
      label: 'Lunch',
      icon: <Sun className="w-5 h-5" />,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      items: isLoss
        ? [
            { name: 'Grilled Chicken Breast (150g)', calories: 248, protein: 47, carbs: 0, fats: 5 },
            { name: 'Quinoa (80g cooked)', calories: 120, protein: 4, carbs: 22, fats: 2 },
            { name: 'Steamed Broccoli & Greens', calories: 55, protein: 4, carbs: 10, fats: 0 },
            { name: 'Olive Oil Dressing (1 tsp)', calories: Math.max(20, lunchCals - 423), protein: 0, carbs: 0, fats: 5 },
          ]
        : isGain
        ? [
            { name: 'Lean Beef / Tuna (200g)', calories: 330, protein: 44, carbs: 0, fats: 15 },
            { name: 'Brown Rice (150g cooked)', calories: 165, protein: 3, carbs: 34, fats: 1 },
            { name: 'Mixed Vegetables (stir-fry)', calories: 80, protein: 3, carbs: 15, fats: 1 },
            { name: 'Whole Wheat Bread (2 slices)', calories: Math.max(100, lunchCals - 575), protein: 8, carbs: 26, fats: 2 },
          ]
        : [
            { name: 'Grilled Salmon (150g)', calories: 280, protein: 39, carbs: 0, fats: 13 },
            { name: 'Sweet Potato (150g)', calories: 130, protein: 2, carbs: 30, fats: 0 },
            { name: 'Garden Salad (Large)', calories: 80, protein: 3, carbs: 12, fats: 3 },
            { name: 'Sparkling Water / Tea', calories: Math.max(5, lunchCals - 490), protein: 0, carbs: 0, fats: 0 },
          ],
    },
    {
      time: '04:00 PM',
      label: 'Snack',
      icon: <Apple className="w-5 h-5" />,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/20',
      items: isLoss
        ? [
            { name: 'Rice Cakes (2)', calories: 70, protein: 1, carbs: 15, fats: 0 },
            { name: 'Low-fat Cottage Cheese (100g)', calories: Math.max(30, snackCals - 70), protein: 11, carbs: 3, fats: 1 },
          ]
        : isGain
        ? [
            { name: 'Protein Bar or Shake', calories: 200, protein: 20, carbs: 20, fats: 6 },
            { name: 'Mixed Nuts (30g)', calories: Math.max(50, snackCals - 200), protein: 6, carbs: 6, fats: 16 },
          ]
        : [
            { name: 'Apple (1 medium)', calories: 95, protein: 0, carbs: 25, fats: 0 },
            { name: 'Peanut Butter (1 tbsp)', calories: Math.max(30, snackCals - 95), protein: 4, carbs: 3, fats: 8 },
          ],
    },
    {
      time: '07:30 PM',
      label: 'Dinner',
      icon: <Moon className="w-5 h-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      items: isLoss
        ? [
            { name: 'Baked Tilapia / Cod (180g)', calories: 189, protein: 39, carbs: 0, fats: 3 },
            { name: 'Steamed Asparagus (150g)', calories: 35, protein: 3, carbs: 6, fats: 0 },
            { name: 'Mixed Greens Salad', calories: 40, protein: 2, carbs: 7, fats: 1 },
            { name: 'Herbal Tea', calories: Math.max(5, dinnerCals - 264), protein: 0, carbs: 0, fats: 0 },
          ]
        : isGain
        ? [
            { name: 'Chicken Thighs (200g)', calories: 340, protein: 38, carbs: 0, fats: 20 },
            { name: 'Pasta / Couscous (200g cooked)', calories: 260, protein: 9, carbs: 52, fats: 2 },
            { name: 'Tomato Sauce & Veggies', calories: 80, protein: 3, carbs: 14, fats: 2 },
            { name: 'Parmesan Cheese (20g)', calories: Math.max(50, dinnerCals - 680), protein: 7, carbs: 0, fats: 6 },
          ]
        : [
            { name: 'Lean Beef Steak (150g)', calories: 280, protein: 35, carbs: 0, fats: 15 },
            { name: 'Roasted Vegetables (200g)', calories: 100, protein: 3, carbs: 20, fats: 2 },
            { name: 'Basmati Rice (100g cooked)', calories: 130, protein: 3, carbs: 28, fats: 0 },
            { name: 'Lemon Water / Sparkling', calories: Math.max(5, dinnerCals - 510), protein: 0, carbs: 0, fats: 0 },
          ],
    },
  ];
};

// ── MacroChip ─────────────────────────────────────────────────────────────────

const MacroChip: React.FC<{ label: string; value: number | string; unit: string; color: string }> = ({
  label, value, unit, color,
}) => (
  <div className={`rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] p-5 flex flex-col gap-1`}>
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{value}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span></span>
  </div>
);

// ── NutritionPlanPage ─────────────────────────────────────────────────────────

export const NutritionPlanPage: React.FC = () => {
  const { user } = useAuth();
  const client = user as ClientProfile;

  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [plan, setPlan] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meals: GeneratedMeal[];
  } | null>(() => {
    // Pre-load if the client already has targets assigned
    if (client?.targetCalories && client?.targetProtein) {
      return {
        calories: client.targetCalories,
        protein: client.targetProtein,
        carbs: client.targetCarbs ?? 0,
        fats: client.targetFats ?? 0,
        meals: buildMealPlan(
          client.targetCalories,
          client.targetProtein,
          client.targetCarbs ?? 0,
          client.targetFats ?? 0,
          client.goal ?? 'maintenance'
        ),
      };
    }
    return null;
  });

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      // Pull the latest profile data
      const profileData = await clientService.getClientById(user.id);
      if (!profileData) {
        toast.error('Could not load your profile. Please try again.');
        return;
      }

      const generated = generatePlanForClient(profileData);

      // Persist the macro targets back to the profile
      await clientService.updateProfile(user.id, {
        targetCalories: generated.targetCalories,
        targetProtein:  generated.targetProtein,
        targetCarbs:    generated.targetCarbs,
        targetFats:     generated.targetFats,
      });

      const meals = buildMealPlan(
        generated.targetCalories,
        generated.targetProtein,
        generated.targetCarbs,
        generated.targetFats,
        profileData.goal ?? 'maintenance'
      );

      setPlan({
        calories: generated.targetCalories,
        protein:  generated.targetProtein,
        carbs:    generated.targetCarbs,
        fats:     generated.targetFats,
        meals,
      });

      toast.success('Nutrition plan generated and saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const waterLiters = client?.weight ? (client.weight * 0.033).toFixed(1) : '2.5';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-[#262626] pb-5">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Nutrition Plan</h2>
          <p className="text-gray-500 dark:text-neutral-400 font-medium">
            Scientifically generated calorie &amp; meal targets based on your physical profile and fitness goal.
          </p>
        </div>
        <Button
          leftIcon={<RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />}
          onClick={handleGenerate}
          isLoading={isGenerating}
          className="w-full sm:w-auto h-12 shadow-sm font-bold uppercase tracking-wider"
        >
          {plan ? 'Regenerate Plan' : 'Generate My Plan'}
        </Button>
      </div>

      {/* No plan yet — call to action */}
      {!plan && (
        <div className="rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 dark:bg-red-500/10 text-[var(--primary)] p-5 rounded-full mb-5">
            <Zap className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Nutrition Plan Yet</h3>
          <p className="text-gray-500 dark:text-neutral-400 max-w-md mb-8 font-medium">
            Click the button below to instantly generate your personalized daily calorie target,
            macro split, and a full sample meal plan — all calculated from your saved profile data.
          </p>
          <Button
            leftIcon={<Zap className="w-5 h-5" />}
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="h-12 px-8 font-bold shadow-sm"
          >
            Generate My Nutrition Plan
          </Button>
        </div>
      )}

      {/* Plan results */}
      {plan && (
        <>
          {/* Macro Summary Cards */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[var(--primary)] mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Daily Macro Targets
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MacroChip label="Calories" value={plan.calories} unit="kcal" color="text-[var(--primary)]" />
              <MacroChip label="Protein"  value={plan.protein}  unit="g"    color="text-blue-500" />
              <MacroChip label="Carbs"    value={plan.carbs}    unit="g"    color="text-amber-500" />
              <MacroChip label="Fats"     value={plan.fats}     unit="g"    color="text-green-500" />
            </div>
          </div>

          {/* Extra info bar */}
          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] px-6 py-4 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Daily Water</p>
                <p className="text-lg font-extrabold text-gray-900 dark:text-white">{waterLiters} L</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] px-6 py-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Goal</p>
                <p className="text-lg font-extrabold text-gray-900 dark:text-white capitalize">
                  {(client?.goal ?? 'maintenance').replace('-', ' ')}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] px-6 py-4 flex items-center gap-3">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-[var(--primary)] rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Training Level</p>
                <p className="text-lg font-extrabold text-gray-900 dark:text-white capitalize">
                  {client?.trainingLevel ?? 'Intermediate'}
                </p>
              </div>
            </div>
          </div>

          {/* Meal Plan */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[var(--primary)] mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Sample Daily Meal Plan
            </h3>
            <div className="space-y-4">
              {plan.meals.map((meal) => {
                const mealTotal = meal.items.reduce((s, i) => s + i.calories, 0);
                const mealProtein = meal.items.reduce((s, i) => s + i.protein, 0);
                const isExpanded = expandedMeal === meal.label;

                return (
                  <div
                    key={meal.label}
                    className="rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] overflow-hidden"
                  >
                    {/* Meal header — always visible, clickable to expand */}
                    <button
                      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                      onClick={() => setExpandedMeal(isExpanded ? null : meal.label)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${meal.bg}`}>
                          <span className={meal.color}>{meal.icon}</span>
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900 dark:text-white">{meal.label}</h4>
                          <p className="text-xs text-gray-400 font-medium">{meal.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex gap-4 text-right">
                          <span className="text-xs text-gray-400">
                            <span className={`font-extrabold text-sm ${meal.color}`}>{mealTotal}</span> kcal
                          </span>
                          <Badge variant="ghost" size="sm">P: {mealProtein}g</Badge>
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                          : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                        }
                      </div>
                    </button>

                    {/* Expandable items */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-[#262626] divide-y divide-gray-50 dark:divide-[#1f1f1f]">
                        {meal.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                          >
                            <span className="font-medium text-sm text-gray-800 dark:text-neutral-200">{item.name}</span>
                            <div className="flex gap-4 text-xs text-gray-400 shrink-0 ml-4">
                              <span className="hidden sm:block">P <span className="font-bold text-blue-500">{item.protein}g</span></span>
                              <span className="hidden sm:block">C <span className="font-bold text-amber-500">{item.carbs}g</span></span>
                              <span className="hidden sm:block">F <span className="font-bold text-green-500">{item.fats}g</span></span>
                              <span className="font-bold text-gray-700 dark:text-neutral-300">{item.calories} kcal</span>
                            </div>
                          </div>
                        ))}
                        {/* Meal subtotal */}
                        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-[#1a1a1a]">
                          <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Meal Total</span>
                          <span className={`font-extrabold ${meal.color}`}>{mealTotal} kcal</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 dark:text-neutral-500 text-center pb-4">
            * This meal plan is an AI-generated sample based on your profile metrics. Actual meals and portions may vary.
            Always consult your coach for a custom adjustment.
          </p>
        </>
      )}
    </div>
  );
};

export default NutritionPlanPage;
