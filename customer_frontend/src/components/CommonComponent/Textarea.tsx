import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type BaseComponentProps } from '../../types/CommonComponents.ts';

// CRITICAL: Ensure you are omitting from TextareaHTMLAttributes, NOT InputHTMLAttributes
interface TextareaProps extends BaseComponentProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  placeholder,
  error,
  layout = 'col',
  rows = 4,
  className = '',
  ...rest // This safely gathers ONLY textarea-specific props now
}) => {
  const isRow = layout === 'row';

  return (
    <div className={`flex ${isRow ? 'flex-row items-start gap-4' : 'flex-col gap-1.5'} w-full ${className}`}>
      {label && (
        <label htmlFor={name} className={`text-sm font-medium text-text-muted ${isRow ? 'w-1/3 text-right pt-2' : 'w-full'}`}>
          {label}
        </label>
      )}

      <div className="flex flex-col flex-1 w-full relative">
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          className={`w-full resize-y rounded-md border bg-bg-main px-3 py-2 text-text-main shadow-sm outline-none transition-colors duration-200 placeholder:text-text-muted/70 focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-border-main focus:border-brand-yellow focus:ring-brand-yellow/20'}
          `}
          {...rest} // Re-applies safe HTMLTextAreaElement properties (like its native onChange)
        />

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
