import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { Program, WorkoutDay, Exercise } from '../../types/workout.types';
import { Button, Input, Spinner } from '../../components/ui';
import { ArrowLeft, Plus, Trash2, Save, Dumbbell } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ProgramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { program, updateProgram, isLoading } = useWorkout(id);
  
  const [editedProgram, setEditedProgram] = useState<Program | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initFromProgram = useCallback(() => {
    if (program) {
      setEditedProgram(JSON.parse(JSON.stringify(program)));
    }
  }, [program]);

  useEffect(() => {
    initFromProgram();
  }, [initFromProgram]);

  if (isLoading || !editedProgram) return <Spinner size="lg" />;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProgram(editedProgram);
      toast.success('Program exercises updated successfully');
      navigate(`/coach/clients/${id}`);
    } catch {
      toast.error('Failed to save program');
    } finally {
      setIsSaving(false);
    }
  };

  const addDay = () => {
    const newDay: WorkoutDay = {
      id: 'day-' + Date.now(),
      dayName: 'Monday',
      isRestDay: false,
      exercises: []
    };
    setEditedProgram({
      ...editedProgram,
      days: [...editedProgram.days, newDay]
    });
  };

  const removeDay = (dayId: string) => {
    setEditedProgram({
      ...editedProgram,
      days: editedProgram.days.filter(d => d.id !== dayId)
    });
  };

  const addExercise = (dayId: string) => {
    const newExercise: Exercise = {
      id: 'ex-' + Date.now(),
      name: '',
      sets: 3,
      reps: '10',
      restSeconds: 60
    };
    
    setEditedProgram({
      ...editedProgram,
      days: editedProgram.days.map(d => {
        if (d.id === dayId) {
          return { ...d, exercises: [...d.exercises, newExercise] };
        }
        return d;
      })
    });
  };

  const updateExercise = (dayId: string, exId: string, field: keyof Exercise, value: any) => {
    setEditedProgram({
      ...editedProgram,
      days: editedProgram.days.map(d => {
        if (d.id === dayId) {
          return {
            ...d,
            exercises: d.exercises.map(ex => ex.id === exId ? { ...ex, [field]: value } : ex)
          };
        }
        return d;
      })
    });
  };

  const removeExercise = (dayId: string, exId: string) => {
    setEditedProgram({
      ...editedProgram,
      days: editedProgram.days.map(d => {
        if (d.id === dayId) {
          return {
            ...d,
            exercises: d.exercises.filter(ex => ex.id !== exId)
          };
        }
        return d;
      })
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={`/coach/clients/${id}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Edit Program</h2>
            <p className="text-gray-500 font-medium">Add or modify exercises for {editedProgram.title}</p>
          </div>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Save Program
        </Button>
      </div>

      <div className="space-y-6">
        {editedProgram.days.map((day, dayIndex) => (
          <div key={day.id} className="card border-2 border-transparent focus-within:border-[var(--primary)] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900">Day {dayIndex + 1}</h3>
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700"
                  value={day.dayName}
                  onChange={(e) => {
                    const newDays = [...editedProgram.days];
                    newDays[dayIndex].dayName = e.target.value as any;
                    setEditedProgram({ ...editedProgram, days: newDays });
                  }}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={day.isRestDay}
                    onChange={(e) => {
                      const newDays = [...editedProgram.days];
                      newDays[dayIndex].isRestDay = e.target.checked;
                      setEditedProgram({ ...editedProgram, days: newDays });
                    }}
                    className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  Rest Day
                </label>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeDay(day.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {!day.isRestDay ? (
              <div className="space-y-4">
                {day.exercises.map((ex, exIndex) => (
                  <div key={ex.id} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="col-span-12 md:col-span-4">
                      <Input 
                        placeholder="Exercise Name" 
                        value={ex.name} 
                        onChange={(e) => updateExercise(day.id, ex.id, 'name', e.target.value)} 
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input 
                        type="number" 
                        placeholder="Sets" 
                        label="Sets"
                        value={ex.sets} 
                        onChange={(e) => updateExercise(day.id, ex.id, 'sets', Number(e.target.value))} 
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input 
                        placeholder="Reps" 
                        label="Reps"
                        value={ex.reps} 
                        onChange={(e) => updateExercise(day.id, ex.id, 'reps', e.target.value)} 
                      />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <Input 
                        type="number" 
                        placeholder="Rest (sec)" 
                        label="Rest (s)"
                        value={ex.restSeconds} 
                        onChange={(e) => updateExercise(day.id, ex.id, 'restSeconds', Number(e.target.value))} 
                      />
                    </div>
                    <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center md:pt-6">
                      <button 
                        onClick={() => removeExercise(day.id, ex.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => addExercise(day.id)}
                  className="w-full border-dashed border-2 text-gray-500 hover:text-[var(--primary)] hover:border-[var(--primary)]"
                >
                  Add Exercise
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <Dumbbell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Rest Day. Time to recover!</p>
              </div>
            )}
          </div>
        ))}

        <Button 
          variant="outline" 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={addDay}
          className="w-full py-8 border-dashed border-2 text-gray-500 hover:text-gray-900"
        >
          Add Workout Day
        </Button>
      </div>
    </div>
  );
};

export default ProgramEditor;
