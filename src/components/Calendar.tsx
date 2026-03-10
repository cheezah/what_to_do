import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  isToday
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange } from 'lucide-react';
import { useStore } from '../store/useStore';
import { isTaskVisibleOnDate } from '../utils/taskUtils';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

type ViewMode = 'month' | 'week';

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const tasks = useStore((state) => state.tasks);

  // Sync internal state when selectedDate changes externally
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const daysToRender = viewMode === 'month' 
    ? eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
      })
    : eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      });

  const handleNext = () => {
    setCurrentDate(prev => viewMode === 'month' ? addMonths(prev, 1) : addWeeks(prev, 1));
  };

  const handlePrev = () => {
    setCurrentDate(prev => viewMode === 'month' ? subMonths(prev, 1) : subWeeks(prev, 1));
  };

  // Helper to count tasks for a day
  const getTaskCount = (date: Date) => {
    return tasks.filter(task => isTaskVisibleOnDate(task, date)).length;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="font-semibold text-gray-800 text-lg min-w-[100px] text-center">
            {format(currentDate, 'yyyy年 M月', { locale: zhCN })}
          </h2>
          <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('month')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CalendarDays size={18} />
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CalendarRange size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysToRender.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);
          const taskCount = getTaskCount(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => {
                onSelectDate(date);
                setCurrentDate(date);
              }}
              className={`
                relative flex flex-col items-center justify-center h-10 w-10 rounded-full text-sm font-medium transition-all
                ${!isCurrentMonth && viewMode === 'month' ? 'text-gray-300' : 'text-gray-700'}
                ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-gray-50'}
                ${isTodayDate && !isSelected ? 'text-blue-600 font-bold bg-blue-50' : ''}
              `}
            >
              <span>{format(date, 'd')}</span>
              
              {/* Task Indicator */}
              {taskCount > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                   <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-blue-500'}`}></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
