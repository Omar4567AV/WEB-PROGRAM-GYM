import React, { useState } from 'react';
import { Modal, Input, Select, Button } from '../../components/ui';
import { progressService } from '../../services/progressService';
import { WeeklyEntry } from '../../types/progress.types';
import { toast } from 'react-hot-toast';

interface WeeklyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSuccess: (entry: WeeklyEntry) => void;
}

const getISOWeek = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
};

export const WeeklyCheckIn: React.FC<WeeklyCheckInProps> = ({
  isOpen,
  onClose,
  clientId,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [mood, setMood] = useState<WeeklyEntry['mood']>('good');
  const [energyLevel, setEnergyLevel] = useState('7');
  const [sleepQuality, setSleepQuality] = useState('7');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setWeight('');
    setWaist('');
    setMood('good');
    setEnergyLevel('7');
    setSleepQuality('7');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const entry = await progressService.addEntry({
        clientId,
        date: new Date().toISOString().split('T')[0],
        weekNumber: getISOWeek(),
        measurements: {
          weight: Number(weight),
          ...(waist ? { waist: Number(waist) } : {}),
        },
        mood,
        energyLevel: Number(energyLevel),
        sleepQuality: Number(sleepQuality),
        notes: notes.trim() || undefined,
      });
      toast.success('Check-in submitted!');
      onSuccess(entry);
      handleClose();
    } catch {
      toast.error('Failed to submit check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Weekly Check-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            placeholder="e.g. 80.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <Input
            label="Waist (cm)"
            type="number"
            step="0.1"
            placeholder="Optional"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
        </div>

        <Select
          label="Mood"
          value={mood}
          onChange={(e) => setMood(e.target.value as WeeklyEntry['mood'])}
          options={[
            { value: 'great', label: 'Great' },
            { value: 'good', label: 'Good' },
            { value: 'average', label: 'Average' },
            { value: 'low', label: 'Low' },
            { value: 'bad', label: 'Bad' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Energy Level (1–10)"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(e.target.value)}
            options={Array.from({ length: 10 }, (_, i) => ({
              value: String(i + 1),
              label: String(i + 1),
            }))}
          />
          <Select
            label="Sleep Quality (1–10)"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(e.target.value)}
            options={Array.from({ length: 10 }, (_, i) => ({
              value: String(i + 1),
              label: String(i + 1),
            }))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold uppercase tracking-wide text-gray-700">
            Notes (optional)
          </label>
          <textarea
            className="w-full bg-white dark:bg-gray-100 border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-red-500/10 transition-all duration-200 min-h-[80px] resize-none"
            placeholder="How did your week go?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="pt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Submit Check-in
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WeeklyCheckIn;
