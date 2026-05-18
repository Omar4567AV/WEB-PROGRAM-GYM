import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-bold uppercase tracking-wide text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white dark:bg-gray-100 border-2 rounded-lg px-4 py-2.5 outline-none transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error 
                ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-red-500/10'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
