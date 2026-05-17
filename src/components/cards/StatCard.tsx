import React from 'react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
}) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          
          {(trend || subtitle) && (
            <div className="mt-2 flex items-center text-sm">
              {trend && (
                <span 
                  className={`font-medium mr-2 ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && (
                <span className="text-gray-500">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-red-50 text-[var(--primary)] rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
