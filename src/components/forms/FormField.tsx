import React, { InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea';
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, as = 'input', className = '', ...props }, ref) => {
    const Component = as;

    return (
      <div className="w-full space-y-1.5">
        <label className="block text-sm font-bold uppercase tracking-wide text-gray-700">
          {label}
        </label>
        
        <Component
          ref={ref as any}
          className={`
            w-full bg-white border-2 rounded-lg px-4 py-2.5 outline-none transition-all duration-200
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-red-500/10'
            }
            ${as === 'textarea' ? 'min-h-[100px] resize-y' : ''}
            ${className}
          `}
          {...(props as any)}
        />
        
        {error && (
          <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
