import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isValid, getYear, getMonth, setYear, setMonth, setDate, setHours, setMinutes } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { backdropVariants, modalVariants } from '../utils/animations';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  isAllDay?: boolean;
  placeholder?: string;
  label?: string;
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const YEARS = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i);

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  isAllDay = false,
  placeholder = '选择日期',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value);
  const [selectedDate, setSelectedDate] = useState(value);
  const [viewMode, setViewMode] = useState<'date' | 'month' | 'year'>('date');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(value);
    setViewDate(value);
  }, [value]);

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

  const getDaysInMonth = (date: Date) => {
    const year = getYear(date);
    const month = getMonth(date);
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekDay = firstDay.getDay() || 7;
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    for (let i = 1; i < startWeekDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = setDate(viewDate, day);
    setSelectedDate(newDate);
    if (isAllDay) {
      onChange(newDate);
      setIsOpen(false);
    } else {
      setViewMode('date');
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    let newDate = setHours(selectedDate, hours);
    newDate = setMinutes(newDate, minutes);
    setSelectedDate(newDate);
    onChange(newDate);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleYearSelect = (year: number) => {
    setViewDate(prev => setYear(prev, year));
    setViewMode('month');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate(prev => setMonth(prev, monthIndex));
    setViewMode('date');
  };

  const formatDisplayValue = () => {
    if (!value || !isValid(value)) return placeholder;
    if (isAllDay) {
      return format(value, 'yyyy年MM月dd日', { locale: zhCN });
    }
    return format(value, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  };

  const days = getDaysInMonth(viewDate);
  const currentHours = selectedDate.getHours();
  const currentMinutes = selectedDate.getMinutes();

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 pr-8 text-sm bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700 text-left flex items-center gap-2 cursor-pointer hover:border-gray-300"
      >
        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
        <span className="truncate">{formatDisplayValue()}</span>
      </button>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 sm:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed sm:absolute inset-x-0 bottom-0 sm:bottom-auto sm:top-full sm:left-0 sm:mt-2 sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                {viewMode === 'date' && (
                  <>
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setViewMode('year')}
                      className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {getYear(viewDate)}年 {MONTHS[getMonth(viewDate)]}
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  </>
                )}
                {viewMode === 'month' && (
                  <>
                    <button
                      onClick={() => setViewMode('year')}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-semibold text-gray-800">{getYear(viewDate)}年</span>
                    <div className="w-8" />
                  </>
                )}
                {viewMode === 'year' && (
                  <>
                    <div className="w-8" />
                    <span className="text-sm font-semibold text-gray-800">选择年份</span>
                    <div className="w-8" />
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {viewMode === 'date' && (
                  <>
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => day && handleDateSelect(day)}
                          disabled={!day}
                          className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                            ${!day ? 'invisible' : ''}
                            ${day === selectedDate.getDate() && getMonth(viewDate) === getMonth(selectedDate) && getYear(viewDate) === getYear(selectedDate)
                              ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/25'
                              : 'text-gray-700 hover:bg-gray-100'
                            }
                          `}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {viewMode === 'month' && (
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`
                          py-3 text-sm font-medium rounded-lg transition-all
                          ${index === getMonth(selectedDate) && getYear(viewDate) === getYear(selectedDate)
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}

                {viewMode === 'year' && (
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`
                          py-3 text-sm font-medium rounded-lg transition-all
                          ${year === getYear(selectedDate)
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}

                {/* Time Selector */}
                {!isAllDay && viewMode === 'date' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">时间</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">时</label>
                        <select
                          value={currentHours}
                          onChange={(e) => handleTimeChange(parseInt(e.target.value), currentMinutes)}
                          className="w-full h-10 px-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-600 appearance-none text-center cursor-pointer"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      </div>
                      <span className="text-lg text-gray-400 mt-5">:</span>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">分</label>
                        <select
                          value={currentMinutes}
                          onChange={(e) => handleTimeChange(currentHours, parseInt(e.target.value))}
                          className="w-full h-10 px-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-600 appearance-none text-center cursor-pointer"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-10 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
