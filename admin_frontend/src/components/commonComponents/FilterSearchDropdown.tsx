import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface FilterSearchDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  onSelect: (value: string | null) => void;
  selectedValue: string | null;
}

export const FilterSearchDropdown: React.FC<FilterSearchDropdownProps> = ({
  label,
  placeholder = "Search and select...",
  options,
  onSelect,
  selectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeOption = options.find(opt => opt.value === selectedValue);
    if (activeOption) {
      setSearchTerm(activeOption.label);
    } else {
      setSearchTerm('');
    }
  }, [selectedValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        const activeOption = options.find(opt => opt.value === selectedValue);
        setSearchTerm(activeOption ? activeOption.label : '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedValue, options]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: DropdownOption) => {
    setSearchTerm(option.label);
    onSelect(option.value);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    setSearchTerm('');
    onSelect(null);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="w-full max-w-xs flex flex-col gap-1.5 relative">
      {label && (
        <label className="text-xs font-semibold text-text-muted">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 pointer-events-none text-text-muted">
          <Search className="w-4 h-4" />
        </div>

        {/* Input Field - Now cleanly matching your theme backgrounds and text mappings */}
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onSelect(null);
          }}
          className="w-full pl-9 pr-16 py-2 border border-border-main bg-bg-card text-text-main placeholder-text-muted/60 rounded-xl text-sm focus:outline-none focus:border-brand-maroon-500 transition-colors shadow-sm"
        />

        {/* Controls Layout Tray */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {searchTerm && (
            <button
              onClick={handleClearSelection}
              type="button"
              className="p-1 hover:bg-bg-main text-text-muted hover:text-brand-maroon-500 rounded-md transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="p-1 text-text-muted hover:text-text-main transition"
          >
            <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Floating Suggestions List Box - Adapts completely to your obsidian dark and white canvas backgrounds */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-bg-card border border-border-main rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-border-main p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-brand-maroon-50 dark:bg-brand-maroon-600/20 text-brand-maroon-500 font-semibold'
                      : 'text-text-main hover:bg-bg-main'
                  }`}
                >
                  {option.label}
                </button>
              );
            })
          ) : (
            <div className="p-3 text-xs text-center text-text-muted italic">
              No matching suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};