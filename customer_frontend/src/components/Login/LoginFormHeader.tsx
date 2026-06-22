import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginFormHeaderProps {
  step: 1 | 2;
  identifierType: 'email' | 'mobile';
}

export const LoginFormHeader: React.FC<LoginFormHeaderProps> = ({ step, identifierType }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-yellow/10 text-brand-yellow mb-4 border border-border-main">
        <LogIn size={22} />
      </div>
      <h2 className="text-3xl font-header font-bold text-text-main">
        {step === 1 ? 'Welcome Back' : 'Verify Identity'}
      </h2>
      <p className="text-sm font-body text-text-muted mt-1.5">
        {step === 1 
          ? 'Enter your registered details to receive an authentication code' 
          : `We sent a code to your registered ${identifierType}`}
      </p>
    </div>
  );
};