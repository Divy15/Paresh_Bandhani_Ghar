import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { Input } from '../components/CommonComponent/Input';
import { NumberInput } from '../components/CommonComponent/NumberInput';
import { OtpInput } from '../components/CommonComponent/OtpInput';
import { Button } from '../components/CommonComponent/Button';
import { LoginFormHeader } from '../components/Login/LoginFormHeader';

interface LoginPageProps {
  onCancel: () => void;
  onNavigateToSignup: () => void; // Prop link to switch view to signup
}

export const LoginPage: React.FC<LoginPageProps> = ({ onCancel, onNavigateToSignup }) => {
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [identifierType, setIdentifierType] = useState<'email' | 'mobile'>('email');
  
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; otp?: string }>({});

  const validateStepOne = () => {
    const newErrors: { identifier?: string } = {};
    if (identifierType === 'email') {
      if (!email) newErrors.identifier = 'Email address is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.identifier = 'Invalid email address';
    } else {
      if (!mobile) newErrors.identifier = 'Mobile number is required';
      else if (mobile.length < 10) newErrors.identifier = 'Enter a valid 10-digit mobile number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStepOne()) {
      const sendOtpPayload = {
        identifierType,
        identifier: identifierType === 'email' ? email : mobile,
      };
      console.log('[Login send OTP API payload preview]', sendOtpPayload);
      setStep(2);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const verifyOtpPayload = {
      identifierType,
      identifier: identifierType === 'email' ? email : mobile,
      otp: otpValue,
    };
    console.log('[Login verify OTP API payload preview]', verifyOtpPayload);

    if (otpValue === '111111') {
      setErrors({});
      const loginResponsePreview = {
        username: 'Divy',
        token: 'mock_jwt_token_payload_xyz',
      };
      console.log('[Login success response preview]', loginResponsePreview);
      login(loginResponsePreview.username, loginResponsePreview.token);
    } else {
      setErrors({ otp: 'Invalid verification code. Use 111111' });
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col md:items-center md:justify-center p-4 md:px-4 font-body">
      <div className="w-full min-h-full max-w-md bg-bg-main p-8 rounded-xl shadow-md border border-border-main">
        <LoginFormHeader step={step} identifierType={identifierType} />

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            {/* Toggle tabs using custom theme tokens */}
            <div className="flex p-1 bg-border-main rounded-lg">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-medium tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                  identifierType === 'email' 
                    ? 'bg-bg-main text-brand-red font-bold shadow-xs' 
                    : 'text-text-muted hover:text-text-main'
                }`}
                onClick={() => { setIdentifierType('email'); setErrors({}); }}
              >
                Email Address
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-medium tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                  identifierType === 'mobile' 
                    ? 'bg-bg-main text-brand-red font-bold shadow-xs' 
                    : 'text-text-muted hover:text-text-main'
                }`}
                onClick={() => { setIdentifierType('mobile'); setErrors({}); }}
              >
                Mobile Number
              </button>
            </div>

            {identifierType === 'email' ? (
              <div className="relative text-text-main">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.identifier}
                />
                <Mail className="absolute right-3 top-9 text-text-muted/60" size={16} />
              </div>
            ) : (
              <div className="relative text-text-main">
                <NumberInput
                  label="Mobile Number"
                  name="mobile"
                  placeholder="Enter mobile number"
                  maxLength={10}
                  value={mobile}
                  onChange={(val) => setMobile(val)}
                  error={errors.identifier}
                />
                <Phone className="absolute right-3 top-9 text-text-muted/60" size={16} />
              </div>
            )}

            {/* Action Row containing Cancel and Proceed buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="cancel" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="submit" icon={<ArrowRight size={14} />} iconPosition="right">
                Get OTP
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <OtpInput
              label="6-Digit Secure Code"
              name="otp_login"
              length={6}
              value={otpValue}
              onChange={setOtpValue}
              error={errors.otp}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="previous" onClick={() => { setStep(1); setOtpValue(''); setErrors({}); }}>
                Back
              </Button>
              <Button type="button" variant="cancel" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="submit" icon={<ShieldCheck size={14} />} iconPosition="left">
                Verify
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Dynamic, Theme-Compliant Registration Message link */}
      {step === 1 && (
        <p className="text-sm text-text-muted mt-6 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="text-brand-red font-semibold underline underline-offset-4 hover:text-brand-yellow transition-colors cursor-pointer"
          >
            Create your account profile here
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginPage;
