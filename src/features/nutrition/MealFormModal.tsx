import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/ui';
import { MealEntry, MealType } from '../../types/calories.types';
import { Camera } from 'lucide-react';

interface FormState {
  name: string;
  mealType: MealType;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  photoUrl: string;
  notes: string;
}

const blank: FormState = {
  name: '',
  mealType: 'breakfast',
  calories: '',
  protein: '',
  carbs: '',
  fats: '',
  photoUrl: '',
  notes: '',
};

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MealEntry, 'id' | 'clientId' | 'date'>) => Promise<void>;
  meal?: MealEntry | null;
  defaultMealType?: MealType;
  isSaving: boolean;
}

export const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  meal,
  defaultMealType = 'breakfast',
  isSaving,
}) => {
  const [form, setForm] = useState<FormState>(blank);

  useEffect(() => {
    if (meal) {
      setForm({
        name: meal.name,
        mealType: meal.mealType,
        calories: String(meal.calories),
        protein: String(meal.protein),
        carbs: String(meal.carbs),
        fats: String(meal.fats),
        photoUrl: meal.photoUrl ?? '',
        notes: meal.notes ?? '',
      });
    } else {
      setForm({ ...blank, mealType: defaultMealType });
    }
  }, [meal, defaultMealType, isOpen]);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setForm(blank);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: form.name.trim(),
      mealType: form.mealType,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
      photoUrl: form.photoUrl.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={meal ? 'Edit Meal' : 'Add Meal'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Meal Name"
            placeholder="e.g. Chicken & Rice"
            value={form.name}
            onChange={set('name')}
            required
          />
          <Select
            label="Meal Type"
            value={form.mealType}
            onChange={set('mealType')}
            options={[
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'dinner', label: 'Dinner' },
              { value: 'snack', label: 'Snack' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input label="Calories" type="number" min="0" placeholder="kcal" value={form.calories} onChange={set('calories')} required />
          <Input label="Protein (g)" type="number" min="0" placeholder="g" value={form.protein} onChange={set('protein')} required />
          <Input label="Carbs (g)" type="number" min="0" placeholder="g" value={form.carbs} onChange={set('carbs')} required />
          <Input label="Fats (g)" type="number" min="0" placeholder="g" value={form.fats} onChange={set('fats')} required />
        </div>

        <div>
          <Input
            label="Meal Photo URL (optional)"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={set('photoUrl')}
            icon={<Camera className="w-4 h-4" />}
          />
          {form.photoUrl && (
            <div className="mt-2 rounded-lg overflow-hidden h-36 bg-gray-100">
              <img
                src={form.photoUrl}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold uppercase tracking-wide text-gray-700">
            Notes (optional)
          </label>
          <textarea
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-red-500/10 bg-white dark:bg-gray-100"
            rows={2}
            placeholder="Prep method, how it tasted, substitutions..."
            value={form.notes}
            onChange={set('notes')}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" fullWidth onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" fullWidth isLoading={isSaving}>
            {meal ? 'Save Changes' : 'Add Meal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MealFormModal;
