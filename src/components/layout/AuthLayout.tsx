import React from 'react';
import { Outlet } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-[var(--primary)] mb-4 shadow-lg shadow-red-500/20">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Coach Platform</h1>
          <p className="text-gray-500">Elevate your fitness journey</p>
        </div>
        
        <div className="card glass relative overflow-hidden">
          {/* Decorative red accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
