import React, { useState } from 'react';
import { calculateCalories } from '../../utils/calorieCalculator';
import { CalorieResult } from '../../types/calories.types';
import { Input, Select, Button, Badge } from '../../components/ui';
import { Calculator, Utensils, Droplets, Activity } from 'lucide-react';
import { formatCalories } from '../../utils/formatters';

export const CaloriesCalculator: React.FC = () => {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [goal, setGoal] = useState<'fat-loss' | 'maintenance' | 'muscle-gain'>('maintenance');
  
  const [result, setResult] = useState<CalorieResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateCalories(age, gender, height, weight, activity, goal);
    setResult(res);
  };

  const getTargetCalories = () => {
    if (!result) return 0;
    if (goal === 'fat-loss') return result.fatLoss;
    if (goal === 'muscle-gain') return result.muscleGain;
    return result.maintenance;
  };

  const getTargetMacros = () => {
    if (!result) return null;
    if (goal === 'fat-loss') return result.macros.fatLoss;
    if (goal === 'muscle-gain') return result.macros.muscleGain;
    return result.macros.maintenance;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Calculator</h2>
        <p className="text-gray-500 font-medium">Calculate your optimal calories and macros based on your goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 card h-fit">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <Calculator className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-bold text-gray-900">Your Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Age" 
                type="number" 
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))} 
                required 
              />
              <Select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
              />
              <Input 
                label="Weight (kg)" 
                type="number" 
                step="0.1"
                value={weight} 
                onChange={(e) => setWeight(Number(e.target.value))} 
                required 
              />
              <Input 
                label="Height (cm)" 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))} 
                required 
              />
            </div>

            <Select
              label="Activity Level"
              value={activity}
              onChange={(e) => setActivity(e.target.value as any)}
              options={[
                { value: 'sedentary', label: 'Sedentary (Office job, no exercise)' },
                { value: 'light', label: 'Lightly Active (1-3 days/week)' },
                { value: 'moderate', label: 'Moderately Active (3-5 days/week)' },
                { value: 'active', label: 'Active (6-7 days/week)' },
                { value: 'very-active', label: 'Very Active (Physical job + training)' }
              ]}
            />

            <Select
              label="Primary Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              options={[
                { value: 'fat-loss', label: 'Fat Loss (Caloric Deficit)' },
                { value: 'maintenance', label: 'Maintenance (Stay Same Weight)' },
                { value: 'muscle-gain', label: 'Muscle Gain (Caloric Surplus)' }
              ]}
            />

            <Button type="submit" fullWidth>Calculate Macros</Button>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="card text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
                <Badge variant="primary" className="mb-4 bg-red-500 text-white border-red-400">
                  Daily Target
                </Badge>
                <h3 className="text-6xl font-bold font-['Oswald'] tracking-tight mb-2">
                  {formatCalories(getTargetCalories())}
                </h3>
                <p className="text-gray-400 font-medium capitalize">
                  for {goal.replace('-', ' ')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card flex flex-col items-center justify-center py-8 hover:-translate-y-1 transition-transform border-b-4 border-b-red-500">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Protein</span>
                  <span className="text-4xl font-bold text-gray-900">{getTargetMacros()?.protein}g</span>
                </div>
                <div className="card flex flex-col items-center justify-center py-8 hover:-translate-y-1 transition-transform border-b-4 border-b-orange-500">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Carbs</span>
                  <span className="text-4xl font-bold text-gray-900">{getTargetMacros()?.carbs}g</span>
                </div>
                <div className="card flex flex-col items-center justify-center py-8 hover:-translate-y-1 transition-transform border-b-4 border-b-yellow-500">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Fats</span>
                  <span className="text-4xl font-bold text-gray-900">{getTargetMacros()?.fats}g</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card flex items-center p-6 gap-4">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase">Daily Water</p>
                    <p className="text-xl font-bold text-gray-900">{result.waterLiters} Liters</p>
                  </div>
                </div>
                <div className="card flex items-center p-6 gap-4">
                  <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase">Estimated BMI</p>
                    <p className="text-xl font-bold text-gray-900">{result.bmi}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 border-2 border-dashed border-gray-200 rounded-xl">
              <Utensils className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">Fill out the form and calculate your targets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaloriesCalculator;
