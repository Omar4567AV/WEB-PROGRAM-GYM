import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { progressService } from '../../services/progressService';
import { WeeklyEntry } from '../../types/progress.types';
import { Spinner, Button } from '../../components/ui';
import { TrendingDown, Calendar, Plus } from 'lucide-react';
import { formatDate, formatWeight } from '../../utils/formatters';

export const ProgressTracking: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WeeklyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      progressService.getProgressByClientId(user.id)
        .then(setEntries)
        .finally(() => setIsLoading(false));
    }
  }, [user?.id]);

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h2>
          <p className="text-gray-500 font-medium">Review your historical data and weekly check-ins.</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          New Check-in
        </Button>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <TrendingDown className="w-5 h-5 text-[var(--primary)]" /> Weight History
        </h3>
        {/* Placeholder for a chart component */}
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-400 font-medium">Chart visualization would render here</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Check-in History</h3>
        
        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No check-ins found. Submit your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="card hover:border-[var(--primary)] transition-colors cursor-pointer group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-[var(--primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Week {entry.weekNumber}</h4>
                      <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Weight</p>
                      <p className="font-bold text-gray-900">{formatWeight(entry.measurements.weight)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Mood</p>
                      <p className="font-bold text-gray-900 capitalize">{entry.mood}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Energy</p>
                      <p className="font-bold text-gray-900">{entry.energyLevel}/10</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracking;
