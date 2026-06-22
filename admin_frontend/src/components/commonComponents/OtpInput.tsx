import React, { useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Keep numeric only
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next field
    if (index < length - 1 && element.value) {
      inputsRef.current[index + 1]?.focus();
    }

    // Trigger completion call
    if (newOtp.every(val => val !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      if (!otp[index] && index > 0) {
        // If current field empty, shift back and clear prior
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      } else {
        // Clear current index
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").substring(0, length);
    if (pastedData.length === length) {
      const pasteArray = pastedData.split("");
      setOtp(pasteArray);
      onComplete(pastedData);
      inputsRef.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => {
            inputsRef.current[index] = el as HTMLInputElement;
          }}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-xl font-bold border rounded-lg bg-bg-card text-text-main border-border-main focus:border-brand-maroon-500 focus:ring-1 focus:ring-brand-maroon-500 outline-none transition-all"
        />
      ))}
    </div>
  );
};