import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type BaseComponentProps } from '../../types/CommonComponents.ts';

interface NumberInputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name'> {
  maxLength?: number;
  onChange?: (value: string) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  name,
  placeholder,
  error,
  maxLength,
  layout = 'col',
  className = '',
  value,
  onChange,
  ...rest
}) => {
  const isRow = layout === 'row';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Regex strictly allows only digits 0-9
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    if (maxLength && numericValue.length > maxLength) return;

    if (onChange) {
      onChange(numericValue);
    }
  };

  return (
    <div className={`flex ${isRow ? 'flex-row items-center gap-4' : 'flex-col gap-1.5'} w-full ${className}`}>
      {label && (
        <label htmlFor={name} className={`text-sm font-medium text-text-muted ${isRow ? 'w-1/3 text-right' : 'w-full'}`}>
          {label}
        </label>
      )}

      <div className="flex flex-col flex-1 w-full relative">
        <input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`min-h-11 w-full rounded-md border bg-bg-main px-3 py-2 pr-14 text-text-main shadow-sm outline-none transition-colors duration-200 placeholder:text-text-muted/70 focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-border-main focus:border-brand-yellow focus:ring-brand-yellow/20'}
          `}
          {...rest}
        />

        {/* Character Count Indicator */}
        {maxLength && (
          <span className="absolute right-2 top-3 text-xs text-text-muted/70">
            {String(value || '').length}/{maxLength}
          </span>
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1 text-xs text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
