import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { backdropVariants, modalVariants, listItemVariants } from '../utils/animations';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '请选择',
  label,
  icon,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full h-10 px-3 pr-8 text-sm rounded-lg border transition-all text-left flex items-center gap-2
          ${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer'
          }
        `}
      >
        {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
        {selectedOption?.icon && !icon && (
          <span className="flex-shrink-0">{selectedOption.icon}</span>
        )}
        {selectedOption?.color && !selectedOption?.icon && (
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: selectedOption.color }}
          />
        )}
        <span className="truncate flex-1">
          {selectedOption?.label || placeholder}
        </span>
      </button>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile: Full screen modal with backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 sm:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            />
            {/* Mobile: Bottom sheet style */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 sm:hidden bg-white rounded-t-2xl shadow-2xl overflow-hidden max-h-[70vh]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-lg font-semibold text-gray-800">{label || '请选择'}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Options List */}
              <div className="overflow-y-auto max-h-[50vh]">
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`
                      w-full px-4 py-4 text-base flex items-center gap-3 border-b border-gray-50 last:border-b-0 transition-colors
                      ${option.value === value
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 active:bg-gray-50'
                      }
                    `}
                  >
                    {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                    {option.color && !option.icon && (
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="flex-1 text-left">{option.label}</span>
                    {option.value === value && (
                      <Check size={20} className="text-blue-600 flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Desktop: Dropdown */}
            <motion.div
              className="hidden sm:block absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl z-50 border border-gray-100"
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="py-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-3 py-2.5 text-sm flex items-center gap-2 transition-colors
                      ${option.value === value
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                    {option.color && !option.icon && (
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="flex-1 text-left">{option.label}</span>
                    {option.value === value && (
                      <Check size={16} className="text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
