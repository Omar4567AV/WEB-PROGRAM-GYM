import React from 'react';

interface CaloriesCircleProps {
  current: number;
  target: number;
  size?: number;
}

export const CaloriesCircle: React.FC<CaloriesCircleProps> = ({ 
  current, 
  target, 
  size = 200 
}) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((current / target) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-gray-100"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-[var(--primary)] transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-['Oswald'] text-gray-900">
          {Math.round(current)}
        </span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
          / {Math.round(target)} kcal
        </span>
      </div>
    </div>
  );
};

export default CaloriesCircle;
