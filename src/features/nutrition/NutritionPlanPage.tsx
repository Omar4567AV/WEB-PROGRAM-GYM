import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { clientService } from '../../services/clientService';
import { generatePlanForClient } from '../../utils/generator';
import { ClientProfile } from '../../types/user.types';
import { Button } from '../../components/ui';
import {
  Zap, Target, Flame, Droplets, ShieldCheck, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── MacroChip ─────────────────────────────────────────────────────────────────

const MacroChip: React.FC<{ label: string; value: number | string; unit: string; color: string }> = ({
  label, value, unit, color,
}) => (
  <div className="rounded-2xl border border-gray-100 dark:border-[#262626] shadow-sm bg-white dark:bg-[#171717] p-5 flex flex-col gap-1">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{value}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span></span>
  </div>
);

// ── NutritionPlanPage ─────────────────────────────────────────────────────────

export const NutritionPlanPage: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const client = user as ClientProfile;

  // localStorage key scoped per user
  const PLAN_KEY = user ? `coach_pro_nutrition_plan_${user.id}` : null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(() => {
    // 1. Try to restore from localStorage first
    if (user) {
      const key = `coach_pro_nutrition_plan_${user.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch { /* ignore */ }
      }
    }
    // 2. Fall back to regenerating from auth-session user targets
    const c = user as ClientProfile;
    if (c?.targetCalories && c?.targetProtein) {
      return {
        calories: c.targetCalories,
        protein:  c.targetProtein,
        carbs:    c.targetCarbs ?? 0,
        fats:     c.targetFats  ?? 0,
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

      // Persist the macro targets back to the profile (coach_pro_clients)
      await clientService.updateProfile(user.id, {
        targetCalories: generated.targetCalories,
        targetProtein:  generated.targetProtein,
        targetCarbs:    generated.targetCarbs,
        targetFats:     generated.targetFats,
      });

      // ✅ Sync the auth-session user so the plan survives page navigation
      updateCurrentUser({
        targetCalories: generated.targetCalories,
        targetProtein:  generated.targetProtein,
        targetCarbs:    generated.targetCarbs,
        targetFats:     generated.targetFats,
      } as Partial<ClientProfile>);

      setPlan({
        calories: generated.targetCalories,
        protein:  generated.targetProtein,
        carbs:    generated.targetCarbs,
        fats:     generated.targetFats,
      });

      // ✅ Persist plan to localStorage so it survives page refresh
      if (PLAN_KEY) {
        localStorage.setItem(PLAN_KEY, JSON.stringify({
          calories: generated.targetCalories,
          protein:  generated.targetProtein,
          carbs:    generated.targetCarbs,
          fats:     generated.targetFats,
        }));
      }

      toast.success('Nutrition targets generated and saved!');
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
            Scientifically generated calorie &amp; macro targets based on your physical profile and fitness goal.
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
            and macro split, all calculated from your saved profile data.
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
        </>
      )}
    </div>
  );
};

export default NutritionPlanPage;
