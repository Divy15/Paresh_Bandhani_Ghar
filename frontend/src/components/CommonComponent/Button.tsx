import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

// 1. Extend HTMLMotionProps instead of standard HTML attributes to align with motion.button
interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'submit' | 'cancel' | 'previous' | 'primary';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean; // 2. Fixed typo from Brass to boolean
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...rest // Now safely spreads all Framer Motion and native button props
}) => {
  // Variant base style mappings
  const variantStyles = {
    submit: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-200',
    cancel: 'bg-rose-100 hover:bg-rose-200 text-rose-700 focus:ring-rose-50',
    previous: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-50',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-200',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  );
};