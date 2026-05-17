import React from 'react';
import { Program } from '../../types/workout.types';
import { Badge } from '../ui/Badge';
import { Calendar, Dumbbell, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick }) => {
  const totalWorkouts = program.days.filter((d) => !d.isRestDay).length;

  return (
    <div 
      className={`card ${onClick ? 'cursor-pointer hover:border-[var(--primary)] transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{program.description}</p>
        </div>
        {program.isActive && (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center text-sm text-gray-600">
          <Dumbbell className="w-4 h-4 mr-2 text-[var(--primary)]" />
          <span className="font-medium">{program.type}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-[var(--primary)]" />
          <span className="font-medium">{totalWorkouts} days/week</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 col-span-2">
          <Calendar className="w-4 h-4 mr-2 text-[var(--primary)]" />
          <span className="font-medium">
            Started: {formatDate(program.startDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
