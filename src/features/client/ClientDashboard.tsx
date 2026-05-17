import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkout } from '../../hooks/useWorkout';
import { progressService } from '../../services/progressService';
import { WeeklyEntry } from '../../types/progress.types';
import { StatCard, ProgramCard } from '../../components/cards';
import { Dumbbell, Target, TrendingDown, Scale } from 'lucide-react';
import { formatWeight, formatDate } from '../../utils/formatters';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { program } = useWorkout(user?.id);
  const [latestProgress, setLatestProgress] = useState<WeeklyEntry | null>(null);

  useEffect(() => {
    if (user?.id) {
      progressService.getLatestEntry(user.id).then(setLatestProgress);
    }
  }, [user?.id]);

  if (!user || user.role !== 'client') return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h2>
        <p className="text-gray-500 font-medium">Here's your latest progress overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Weight"
          value={latestProgress ? formatWeight(latestProgress.measurements.weight) : '--'}
          icon={<Scale className="w-6 h-6" />}
          subtitle={latestProgress ? `As of ${formatDate(latestProgress.date)}` : undefined}
        />
        <StatCard
          title="Active Program"
          value={program ? program.type : 'None'}
          icon={<Dumbbell className="w-6 h-6" />}
          subtitle={program ? program.title : undefined}
        />
        <StatCard
          title="Energy Level"
          value={latestProgress ? `${latestProgress.energyLevel}/10` : '--'}
          icon={<TrendingDown className="w-6 h-6" />}
          subtitle="From last check-in"
        />
        <StatCard
          title="Goal"
          value={<span className="capitalize">{(user as any).goal?.replace('-', ' ') || 'Not Set'}</span>}
          icon={<Target className="w-6 h-6" />}
          subtitle="Current focus"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Current Program</h3>
          {program ? (
            <ProgramCard program={program} />
          ) : (
            <div className="card text-center py-12">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active program assigned yet.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Updates</h3>
          <div className="card">
            {latestProgress ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Latest Check-in</p>
                  <p className="font-bold">{formatDate(latestProgress.date)}</p>
                </div>
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Coach Notes</p>
                  <p className="text-sm italic text-gray-700">"Keep up the great work! Let's push a bit harder on the legs this week."</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No recent updates.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
