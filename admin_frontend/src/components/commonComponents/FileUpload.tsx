import React, { useRef } from 'react';

interface FileUploadProps {
  label: string;
  onChange: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, multiple = true, accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-text-main mb-1.5">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border-main hover:border-brand-maroon-500 rounded-xl p-6 text-center cursor-pointer bg-bg-main transition-colors group"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple={multiple} 
          accept={accept}
          onChange={(e) => e.target.files && onChange(e.target.files)}
        />
        <span className="text-2xl block mb-1">📤</span>
        <p className="text-sm text-text-muted group-hover:text-brand-maroon-500 font-medium transition-colors">
          Click to upload images/videos
        </p>
        <p className="text-xs text-text-muted opacity-60 mt-0.5">Multiple files supported</p>
      </div>
    </div>
  );
};