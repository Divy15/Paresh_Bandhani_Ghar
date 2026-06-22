import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-text-main text-sm">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-border-main text-brand-maroon-500 accent-brand-maroon-500 focus:ring-0"
        {...props}
      />
      {label}
    </label>
  );
};