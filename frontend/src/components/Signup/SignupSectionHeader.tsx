import React from 'react';

interface SignupSectionHeaderProps {
  title: string;
}

export const SignupSectionHeader: React.FC<SignupSectionHeaderProps> = ({ title }) => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b border-border-main pb-2 mt-4">
      <h4 className="text-xs font-body font-bold tracking-widest text-brand-yellow uppercase">
        {title}
      </h4>
    </div>
  );
};