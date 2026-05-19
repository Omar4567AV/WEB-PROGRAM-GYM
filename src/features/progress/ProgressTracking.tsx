import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { progressService } from '../../services/progressService';
import { WeeklyEntry } from '../../types/progress.types';
import { Spinner, Button } from '../../components/ui';
import { 
  TrendingDown, Calendar, Plus, Scale, Target, Activity, Flame, 
  ShieldCheck, MessageSquare, Inbox
} from 'lucide-react';
import { formatDate, formatWeight } from '../../utils/formatters';
import { WeeklyCheckIn } from './WeeklyCheckIn';

export const ProgressTracking: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WeeklyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      progressService.getProgressByClientId(user.id)
        .then(setEntries)
        .finally(() => setIsLoading(false));
    }
  }, [user?.id]);

  const getWeeklyChange = () => {
    if (entries.length < 2) return { text: '--', color: 'text-gray-400', isUp: false };
    const latest = entries[0].measurements.weight;
    const previous = entries[1].measurements.weight;
    const diff = latest - previous;
    const diffText = diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
    
    // Determine if weight change matches goal
    const isLoss = diff < 0;
    const isGain = diff > 0;
    let isGood = false;
    
    if (user && 'goal' in user) {
      const goal = (user as any).goal;
      if (goal === 'fat-loss' && isLoss) isGood = true;
      if (goal === 'muscle-gain' && isGain) isGood = true;
    }
    
    return {
      text: diffText,
      color: diff === 0 ? 'text-gray-500' : (isGood ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'),
      isUp: diff > 0
    };
  };

  const renderChart = () => {
    if (entries.length === 0) {
      return (
        <div className="h-48 sm:h-64 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-6">
          <TrendingDown className="w-10 h-10 text-gray-300 mb-3 animate-pulse" />
          <p className="text-gray-400 font-bold text-sm text-center">Submit a check-in to start visualizing your weight history trend</p>
        </div>
      );
    }

    // Chronological order (oldest first)
    const sortedEntries = [...entries].reverse();
    const weights = sortedEntries.map(e => e.measurements.weight);
    
    const minWeight = Math.min(...weights) - 2;
    const maxWeight = Math.max(...weights) + 2;
    const range = maxWeight - minWeight || 4;

    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Map weights to X, Y coordinates
    const points = sortedEntries.map((entry, index) => {
      const x = paddingLeft + (index / Math.max(1, sortedEntries.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((entry.measurements.weight - minWeight) / range) * chartHeight;
      return { x, y, weight: entry.measurements.weight, date: entry.date, week: entry.weekNumber };
    });

    // Build the SVG path string
    let pathD = '';
    let areaD = '';
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      areaD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x} ${points[i].y}`;
        areaD += ` L ${points[i].x} ${points[i].y}`;
      }
      areaD += ` L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
    }

    return (
      <div className="w-full overflow-x-auto mt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-48 sm:h-56 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
            </linearGradient>
          </defs>
          
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = paddingTop + r * chartHeight;
            const wVal = maxWeight - r * range;
            return (
              <g key={i} className="opacity-40">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="text-[9px] fill-gray-400 font-semibold">{wVal.toFixed(1)}</text>
              </g>
            );
          })}

          {/* Area fill */}
          {points.length > 1 && (
            <path d={areaD} fill="url(#chartGradient)" />
          )}

          {/* Line path */}
          {points.length > 1 && (
            <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Circle markers & values */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="4" fill="white" stroke="var(--primary)" strokeWidth="2" />
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" className="text-[9px] fill-gray-700 font-extrabold bg-white">{pt.weight} kg</text>
              <text x={pt.x} y={height - 12} textAnchor="middle" className="text-[9px] fill-gray-400 font-semibold">Wk {pt.week}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  if (isLoading) return <Spinner size="lg" />;

  const weeklyChangeData = getWeeklyChange();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header section: title and responsive button placement */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Progress Tracking</h2>
          <p className="text-gray-500 font-medium">Review your historical physical metrics and weekly dashboard updates.</p>
        </div>
        <Button 
          leftIcon={<Plus className="w-5 h-5" />} 
          onClick={() => setIsCheckInOpen(true)}
          className="w-full sm:w-auto h-12 shadow-sm font-bold uppercase tracking-wider"
        >
          New Check-in
        </Button>
      </div>

      {/* Responsive Dashboard Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Current Weight */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Weight</span>
            <h3 className="text-2xl font-black text-gray-900">
              {entries.length > 0 ? formatWeight(entries[0].measurements.weight) : '--'}
            </h3>
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
              Initial: {user && 'weight' in user ? formatWeight((user as any).weight) : '--'}
            </span>
          </div>
          <div className="bg-red-50 text-[var(--primary)] p-3.5 rounded-2xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Last Check-In */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Check-In</span>
            <h3 className="text-2xl font-black text-gray-900">
              {entries.length > 0 ? formatDate(entries[0].date) : 'None Yet'}
            </h3>
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
              Total check-ins: {entries.length}
            </span>
          </div>
          <div className="bg-red-50 text-[var(--primary)] p-3.5 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Goal Progress */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fitness Goal</span>
            <h3 className="text-2xl font-black text-gray-900 capitalize">
              {user && 'goal' in user ? (user as any).goal.replace('-', ' ') : 'Not Set'}
            </h3>
            <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Goal Plan Active
            </span>
          </div>
          <div className="bg-red-50 text-[var(--primary)] p-3.5 rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Weekly Change */}
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weekly Change</span>
            <h3 className={`text-2xl font-black ${weeklyChangeData.color}`}>
              {weeklyChangeData.text}
            </h3>
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
              Trend from last week
            </span>
          </div>
          <div className="bg-red-50 text-[var(--primary)] p-3.5 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Breathtaking Pure SVG Weight History Chart Card */}
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <TrendingDown className="w-5 h-5 text-[var(--primary)]" /> Weight History Trend
        </h3>
        {renderChart()}
      </div>

      {/* Check-in History Timeline List */}
      <div className="space-y-5">
        <h3 className="text-xl font-bold text-gray-900">Check-in History</h3>
        
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 text-gray-400 p-5 rounded-full mb-4">
              <Inbox className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">No check-ins yet</h4>
            <p className="text-gray-500 max-w-sm mb-6 font-medium">
              Keep yourself accountable by logging your current weight, energy levels, mood, and trainer updates.
            </p>
            <Button onClick={() => setIsCheckInOpen(true)} className="h-11 px-6 font-bold shadow-sm">
              Create First Check-In
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 hover:border-[var(--primary)] transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-[var(--primary)] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Week {entry.weekNumber} Assessment</h4>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Weight</p>
                      <p className="font-extrabold text-gray-900 text-sm sm:text-base">{formatWeight(entry.measurements.weight)}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Mood</p>
                      <p className="font-extrabold text-gray-900 text-sm sm:text-base capitalize">{entry.mood}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Energy</p>
                      <p className="font-extrabold text-gray-900 text-sm sm:text-base">{entry.energyLevel}/10</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {user?.id && (
        <WeeklyCheckIn
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
          clientId={user.id}
          onSuccess={(entry) => setEntries((prev) => [entry, ...prev])}
        />
      )}
    </div>
  );
};

export default ProgressTracking;
