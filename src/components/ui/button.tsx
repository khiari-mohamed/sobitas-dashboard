'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'secondary';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', loading, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? 'Chargement...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
