import React, { useState } from 'react';
import { LoginForm } from '../components/login/Login';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    // Mocking an initial SMS trigger system success window
    toast.success('🔑 OTP Code sent to +91 ' + phone, {
      icon: '✨',
      style: { background: 'var(--bg-card)', color: 'var(--text-main)' }
    });
    setStep('otp');
  };

  const handleOtpVerify = (otp: string) => {
    if (otp === '123456') { // Standard Mock Code for testing
      toast.success('Access Authenticated Successfully!', { icon: '🎉' });
      setTimeout(() => {
        login(phoneNumber);
      }, 1000);
    } else {
      toast.error('Invalid Verification Code! Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex items-center justify-center p-4 transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-md bg-bg-card border border-border-main rounded-2xl shadow-xl overflow-hidden p-8 relative">
        {/* Subtle geometric design block nodding to Bandhani pattern */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-brand-maroon-500 via-brand-gold-500 to-brand-maroon-600" />
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-extrabold text-brand-maroon-500 tracking-wide">
            Paresh Bandhani Ghar
          </h1>
          <p className="text-sm text-text-muted mt-1">Saree & Dress Enterprise Portal</p>
        </div>

        <AnimatePresence mode="wait">
          <LoginForm 
            step={step} 
            onPhoneSubmit={handlePhoneSubmit} 
            onOtpSubmit={handleOtpVerify} 
            phoneNumber={phoneNumber}
            onBackToPhone={() => setStep('phone')}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};