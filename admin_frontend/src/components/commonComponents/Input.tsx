import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isCommonCheck?: boolean;
  onCommonToggle?: (checked: boolean) => void;
  showCommonOption?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  isCommonCheck,
  onCommonToggle,
  showCommonOption = false,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-main">{label}</label>
        {showCommonOption && onCommonToggle && (
          <label className="flex items-center gap-1.5 text-xs text-brand-maroon-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCommonCheck}
              onChange={(e) => onCommonToggle(e.target.checked)}
              className="rounded accent-brand-maroon-500"
            />
            Apply to all
          </label>
        )}
      </div>
      <input
        className={`px-3 py-2 rounded-lg border border-border-main bg-bg-main text-text-main focus:outline-none focus:border-brand-maroon-500 transition-colors disabled:opacity-60 ${className}`}
        {...props}
      />
    </div>
  );
};