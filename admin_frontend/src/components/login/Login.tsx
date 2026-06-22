import React, { useState } from 'react';
import { OtpInput } from '../commonComponents/OtpInput';
import { motion } from 'motion/react';

interface LoginFormProps {
  step: 'phone' | 'otp';
  phoneNumber: string;
  onPhoneSubmit: (phone: string) => void;
  onOtpSubmit: (otp: string) => void;
  onBackToPhone: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  step, 
  phoneNumber, 
  onPhoneSubmit, 
  onOtpSubmit,
  onBackToPhone 
}) => {
  const [phoneInput, setPhoneInput] = useState('');

  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length >= 10) {
      onPhoneSubmit(phoneInput);
    }
  };

  if (step === 'phone') {
    return (
      <motion.form 
        key="phone-step"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        onSubmit={submitPhone}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Registered Mobile Number
          </label>
          <div className="relative rounded-lg shadow-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted text-sm font-semibold">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              pattern="[0-9]{10}"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit mobile"
              className="w-full pl-12 pr-4 py-3 bg-bg-main border border-border-main text-text-main rounded-lg outline-none focus:ring-1 focus:ring-brand-maroon-500 focus:border-brand-maroon-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Send Verification Code
        </button>
      </motion.form>
    );
  }

  return (
    <motion.div 
      key="otp-step"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <p className="text-sm text-text-muted">
          Enter code delivered to <strong className="text-text-main">+91 {phoneNumber}</strong>
        </p>
      </div>

      <OtpInput length={6} onComplete={onOtpSubmit} />

      <div className="text-center mt-4">
        <button 
          onClick={onBackToPhone}
          className="text-xs font-semibold text-brand-gold-500 hover:underline cursor-pointer"
        >
          Change Phone Number
        </button>
      </div>
    </motion.div>
  );
};