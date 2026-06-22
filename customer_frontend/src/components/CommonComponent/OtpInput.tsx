import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type BaseComponentProps } from '../../types/CommonComponents.ts';

interface OtpInputProps extends BaseComponentProps {
  length?: number;
  value: string; // Add this line to accept the string value from parent state
  onChange: (value: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  label,
  name,
  error,
  layout = 'col',
  length = 6,
  className = '',
  value, // Destructure value here
  onChange,
}) => {
  const isRow = layout === 'row';
  
  // Convert the incoming single string value into an array of digits for the 6 boxes
  const otpArray = value.split('').concat(new Array(length).fill('')).slice(0, length);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const inputValue = element.value;
    if (/[^0-9]/.test(inputValue)) return; // Only allow numbers

    const newOtpArray = [...otpArray];
    newOtpArray[index] = inputValue.substring(inputValue.length - 1);
    
    // Combine array back to a single string and send to parent state
    onChange(newOtpArray.join(''));

    // Move focus forward
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      // If box is empty, clear previous box and shift focus back
      if (!otpArray[index] && index > 0) {
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = '';
        onChange(newOtpArray.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/[^0-9]/.test(pastedData)) return;

    const pastedDigits = pastedData.split('').slice(0, length);
    onChange(pastedDigits.join(''));

    const focusIndex = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={`flex ${isRow ? 'flex-row items-center gap-4' : 'flex-col gap-1.5'} w-full ${className}`}>
      {label && (
        <label htmlFor={name} className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRow ? 'w-1/3 text-right' : 'w-full'}`}>
          {label}
        </label>
      )}

      <div className="flex flex-col flex-1 w-full relative">
        <div className="flex gap-2 items-center">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otpArray[index] || ''}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-12 h-12 text-center text-lg font-bold border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-150
                ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-500'}
              `}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};