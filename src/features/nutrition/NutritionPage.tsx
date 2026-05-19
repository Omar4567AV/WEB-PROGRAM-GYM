import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { nutritionService } from '../../services/nutritionService';
import { MealEntry, MealType } from '../../types/calories.types';
import { ClientProfile } from '../../types/user.types';
import { Button, Badge, Spinner } from '../../components/ui';
import { MealFormModal } from './MealFormModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Edit2,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── helpers ───────────────────────────────────────────────────────────────────

const toDateStr = (d: Date) => d.toISOString().split('T')[0];

const formatDateLabel = (s: string): string => {
  const today = toDateStr(new Date());
  const yesterday = toDateStr(new Date(Date.now() - 86400000));
  if (s === today) return 'Today';
  if (s === yesterday) return 'Yesterday';
  return new Date(s + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// ── meal section metadata ─────────────────────────────────────────────────────

const SECTIONS: { type: MealType; label: string; color: string; bg: string }[] = [
  { type: 'breakfast', label: 'Breakfast', color: 'text-amber-600',  bg: 'bg-amber-50'  },
  { type: 'lunch',     label: 'Lunch',     color: 'text-green-600',  bg: 'bg-green-50'  },
  { type: 'dinner',    label: 'Dinner',    color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { type: 'snack',     label: 'Snack',     color: 'text-purple-600', bg: 'bg-purple-50' },
];

// ── MacroBar ──────────────────────────────────────────────────────────────────

interface MacroBarProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  barColor: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, value, target, unit, barColor }) => {
  const pct = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
  const over = value > target;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={`font-bold ${over ? 'text-red-500' : 'text-gray-900'}`}>
          {value}
          <span className="text-gray-400 font-normal">
            /{target}
            {unit}
          </span>
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${over ? 'bg-red-500' : barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── MealCard ──────────────────────────────────────────────────────────────────

interface MealCardProps {
  meal: MealEntry;
  onEdit: () => void;
  onDelete: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onEdit, onDelete }) => (
  <div className="card !p-0 overflow-hidden group">
    {meal.photoUrl && (
      <div className="h-36 overflow-hidden bg-gray-100">
        <img
          src={meal.photoUrl}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            if (el.parentElement) el.parentElement.style.display = 'none';
          }}
        />
      </div>
    )}
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold text-gray-900 leading-tight truncate">{meal.name}</h4>
          {meal.notes && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{meal.notes}</p>
          )}
        </div>
        <span className="text-xl font-bold text-[var(--primary)] whitespace-nowrap shrink-0">
          {meal.calories}
          <span className="text-xs font-normal text-gray-400 ml-0.5">kcal</span>
        </span>
      </div>

      <div className="flex gap-4 text-xs text-gray-500">
        <span>
          <span className="font-bold text-blue-500">P </span>
          {meal.protein}g
        </span>
        <span>
          <span className="font-bold text-amber-500">C </span>
          {meal.carbs}g
        </span>
        <span>
          <span className="font-bold text-green-500">F </span>
          {meal.fats}g
        </span>
      </div>

      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── NutritionPage ─────────────────────────────────────────────────────────────

export const NutritionPage: React.FC = () => {
  const { user } = useAuth();
  const client = user as ClientProfile;

  const targets = {
    calories: client?.targetCalories ?? 2000,
    protein:  client?.targetProtein  ?? 150,
    carbs:    client?.targetCarbs    ?? 200,
    fats:     client?.targetFats     ?? 65,
  };

  const [date, setDate]             = useState(toDateStr(new Date()));
  const [meals, setMeals]           = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [defaultType, setDefaultType] = useState<MealType>('breakfast');
  const [isSaving, setIsSaving]     = useState(false);

  const loadMeals = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await nutritionService.getMealsByDate(user.id, date);
      setMeals(data);
    } catch {
      toast.error('Failed to load meals');
    } finally {
      setIsLoading(false);
    }
  }, [user, date]);

  useEffect(() => { loadMeals(); }, [loadMeals]);

  const shiftDate = (dir: -1 | 1) => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + dir);
    setDate(toDateStr(d));
  };

  const openAdd = (type: MealType) => {
    setEditingMeal(null);
    setDefaultType(type);
    setModalOpen(true);
  };

  const openEdit = (meal: MealEntry) => {
    setEditingMeal(meal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMeal(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this meal?')) return;
    try {
      await nutritionService.deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
      toast.success('Meal removed');
    } catch {
      toast.error('Failed to remove meal');
    }
  };

  const handleSubmit = async (data: Omit<MealEntry, 'id' | 'clientId' | 'date'>) => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      if (editingMeal) {
        const updated = await nutritionService.updateMeal(editingMeal.id, data);
        setMeals((prev) => prev.map((m) => (m.id === editingMeal.id ? updated : m)));
        toast.success('Meal updated');
      } else {
        const created = await nutritionService.createMeal(user.id, { ...data, date });
        setMeals((prev) => [...prev, created]);
        toast.success('Meal added');
      }
      closeModal();
    } catch {
      toast.error('Failed to save meal');
    } finally {
      setIsSaving(false);
    }
  };

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein:  acc.protein  + m.protein,
      carbs:    acc.carbs    + m.carbs,
      fats:     acc.fats     + m.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const grouped = SECTIONS.reduce(
    (acc, s) => {
      acc[s.type] = meals.filter((m) => m.mealType === s.type);
      return acc;
    },
    {} as Record<MealType, MealEntry[]>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Meal Diary</h2>
          <p className="text-gray-500 font-medium">Track your daily nutrition, meal by meal.</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => openAdd('breakfast')}>
          Add Meal
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="card !py-4 flex items-center justify-between">
        <button
          onClick={() => shiftDate(-1)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{formatDateLabel(date)}</p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
        <button
          onClick={() => shiftDate(1)}
          disabled={date >= toDateStr(new Date())}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Daily Summary */}
      {!isLoading && meals.length > 0 && (
        <div className="card space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Daily Summary</h3>
            <Badge variant="ghost" size="sm">
              {meals.length} meal{meals.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MacroBar label="Calories" value={totals.calories} target={targets.calories} unit=" kcal" barColor="bg-[var(--primary)]" />
            <MacroBar label="Protein"  value={totals.protein}  target={targets.protein}  unit="g"    barColor="bg-blue-500"          />
            <MacroBar label="Carbs"    value={totals.carbs}    target={targets.carbs}    unit="g"    barColor="bg-amber-500"         />
            <MacroBar label="Fats"     value={totals.fats}     target={targets.fats}     unit="g"    barColor="bg-green-500"         />
          </div>
        </div>
      )}

      {/* Meal Sections */}
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="space-y-8">
          {SECTIONS.map(({ type, label, color, bg }) => {
            const sectionMeals = grouped[type];
            const sectionCals  = sectionMeals.reduce((s, m) => s + m.calories, 0);

            return (
              <div key={type} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bg}`}>
                      <Utensils className={`w-4 h-4 ${color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{label}</h3>
                      {sectionMeals.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {sectionCals} kcal · {sectionMeals.length} item{sectionMeals.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => openAdd(type)}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg ${bg} ${color} hover:opacity-80 transition-opacity`}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Cards or empty state */}
                {sectionMeals.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sectionMeals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onEdit={() => openEdit(meal)}
                        onDelete={() => handleDelete(meal.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => openAdd(type)}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add {label}
                  </button>
                )}
              </div>
            );
          })}

          {/* Truly empty day */}
          {meals.length === 0 && (
            <div className="card text-center py-16">
              <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Meals Logged</h3>
              <p className="text-gray-500 mb-6">Start tracking by adding your first meal for {formatDateLabel(date)}.</p>
              <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => openAdd('breakfast')}>
                Add First Meal
              </Button>
            </div>
          )}
        </div>
      )}

      <MealFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        meal={editingMeal}
        defaultMealType={defaultType}
        isSaving={isSaving}
      />
    </div>
  );
};

export default NutritionPage;
