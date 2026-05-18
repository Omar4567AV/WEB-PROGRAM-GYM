import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkout } from '../../hooks/useWorkout';
import { Badge, Spinner, Button } from '../../components/ui';
import { Dumbbell, Clock, PlayCircle, Info } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const WorkoutProgram: React.FC = () => {
  const { user } = useAuth();
  const { program, isLoading } = useWorkout(user?.id);

  if (isLoading) return <Spinner size="lg" />;

  if (!program) {
    return (
      <div className="card text-center py-24">
        <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Program</h3>
        <p className="text-gray-500">Your coach hasn't assigned a workout program yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="success" className="mb-4">Active Program</Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{program.title}</h2>
        <p className="text-gray-500 font-medium text-lg">{program.description}</p>

        <div className="flex gap-4 mt-6">
          <Badge variant="ghost" size="md">{program.type}</Badge>
          <Badge variant="ghost" size="md">Started {formatDate(program.startDate)}</Badge>
        </div>
      </div>

      <div className="space-y-6">
        {program.days.map((day) => (
          <div key={day.id} className="card overflow-hidden">
            <div className={`p-4 border-b border-gray-100 flex justify-between items-center ${day.isRestDay ? 'bg-gray-50' : 'bg-red-50'}`}>
              <h3 className={`text-xl font-bold ${day.isRestDay ? 'text-gray-600' : 'text-gray-900'}`}>
                {day.dayName}
              </h3>
              {day.isRestDay ? (
                <Badge variant="ghost">Rest Day</Badge>
              ) : (
                <Badge variant="primary">{day.exercises.length} Exercises</Badge>
              )}
            </div>

            {!day.isRestDay && (
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Exercise</th>
                      <th className="px-6 py-4 text-center">Sets x Reps</th>
                      <th className="px-6 py-4 text-center">Rest</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {day.exercises.map((exercise) => (
                      <tr key={exercise.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{exercise.name}</p>
                          {exercise.notes && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Info className="w-3 h-3" /> {exercise.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          {exercise.sets} × {exercise.reps}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4" /> {exercise.restSeconds}s
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {exercise.videoUrl ? (
                            <Button variant="ghost" size="sm" className="text-[var(--primary)] p-2">
                              <PlayCircle className="w-5 h-5" />
                            </Button>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {day.isRestDay && (
              <div className="p-8 text-center text-gray-500">
                Focus on recovery, hydration, and stretching.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgram;
