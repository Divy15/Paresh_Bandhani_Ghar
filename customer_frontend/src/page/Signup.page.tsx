import React, { useState } from 'react';
import { User, Mail, MapPin, Building, Globe, Send, UserCheck } from 'lucide-react';
import { Input } from '../components/CommonComponent/Input';
import { NumberInput } from '../components/CommonComponent/NumberInput';
import { Textarea } from '../components/CommonComponent/Textarea';
import { Button } from '../components/CommonComponent/Button';
import { SignupSectionHeader } from '../components/Signup/SignupSectionHeader';

interface FormFields {
  firstName: string; middleName: string; lastName: string;
  email: string; mobileNo: string; address: string;
  city: string; state: string; country: string; pinCode: string;
}

interface SignupPageProps {
  onCancel: () => void; // Connects to App.tsx's state switcher instead of raw hardcoded routes
}

export default function SignupPage({ onCancel }: SignupPageProps) {
  const [formData, setFormData] = useState<FormFields>({
    firstName: '', middleName: '', lastName: '',
    email: '', mobileNo: '', address: '',
    city: '', state: '', country: '', pinCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name required';
    if (!formData.lastName) newErrors.lastName = 'Last name required';
    if (!formData.email) newErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.mobileNo) newErrors.mobileNo = 'Mobile number required';
    else if (formData.mobileNo.length < 10) newErrors.mobileNo = 'Must be 10 digits';
    if (!formData.address) newErrors.address = 'Address required';
    if (!formData.city) newErrors.city = 'City required';
    if (!formData.state) newErrors.state = 'State required';
    if (!formData.country) newErrors.country = 'Country required';
    if (!formData.pinCode) newErrors.pinCode = 'Pincode required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormFields, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const signupPayload = {
        ...formData,
        fullName: [formData.firstName, formData.middleName, formData.lastName]
          .filter(Boolean)
          .join(' '),
      };
      console.log('[Signup API payload preview]', signupPayload);
      alert('Registration Successful! Redirecting to login panel...');
      onCancel(); // Transitions state to login safely without breaking context
    }
  };

  return (
    <div className="min-h-[100vh] py-12 px-4 flex items-center justify-center font-body">
      <div className="w-full max-w-4xl bg-bg-main p-8 rounded-xl shadow-md border border-border-main">
        
        {/* Registration Header Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-yellow/10 text-brand-yellow mb-3 border border-border-main">
            <UserCheck size={22} />
          </div>
          <h2 className="text-3xl font-header font-bold text-text-main">Create Your Account</h2>
          <p className="text-sm text-text-muted mt-1.5">Provide your details to complete your profile setup</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            
            <SignupSectionHeader title="Personal Information" />
            
            <div className="relative text-text-main">
              <Input label="First Name *" name="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} error={errors.firstName} />
              <User className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <Input label="Middle Name" name="middleName" value={formData.middleName} onChange={(e) => handleInputChange('middleName', e.target.value)} />
              <User className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <Input label="Last Name *" name="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} error={errors.lastName} />
              <User className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <SignupSectionHeader title="Contact Communication" />

            <div className="relative text-text-main">
              <Input label="Email Address *" name="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} error={errors.email} />
              <Mail className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <NumberInput label="Mobile Number *" name="mobileNo" maxLength={10} value={formData.mobileNo} onChange={(val) => handleInputChange('mobileNo', val)} error={errors.mobileNo} />
              {/* <Phone className="absolute right-3 top-9 text-text-muted/50" size={16} /> */}
            </div>

            <SignupSectionHeader title="Location Address Details" />

            <div className="relative col-span-1 md:col-span-2 lg:col-span-3 text-text-main">
              <Textarea label="Full Street Address *" name="address" rows={2} value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} error={errors.address} />
              <MapPin className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <Input label="City *" name="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} error={errors.city} />
              <Building className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <Input label="State *" name="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} error={errors.state} />
              <MapPin className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <Input label="Country *" name="country" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} error={errors.country} />
              <Globe className="absolute right-3 top-9 text-text-muted/50" size={16} />
            </div>

            <div className="relative text-text-main">
              <NumberInput label="Pin Code *" name="pinCode" maxLength={6} value={formData.pinCode} onChange={(val) => handleInputChange('pinCode', val)} error={errors.pinCode} />
              {/* <MapPin className="absolute right-3 top-9 text-text-muted/50" size={16} /> */}
            </div>
          </div>

          {/* Core Actions Panel */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border-main">
            <Button variant="cancel" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="submit" type="submit" icon={<Send size={14} />}>
              Register Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
