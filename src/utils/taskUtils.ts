import { startOfDay, endOfDay, differenceInCalendarDays, addWeeks, addMonths, addYears, addDays } from 'date-fns';
import type { Task } from '../types';

/**
 * Checks if a task is visible on a specific date, considering:
 * 1. Start and End dates (Multi-day events)
 * 2. Repeat rules (Daily, Weekly, Monthly, Yearly)
 */
export const isTaskVisibleOnDate = (task: Task, date: Date): boolean => {
  const taskStart = new Date(task.startDate);
  // Invalid date check
  if (isNaN(taskStart.getTime())) return false;
  
  const checkDate = startOfDay(date);
  const startDay = startOfDay(taskStart);
  
  // If check date is before the task starts, it's definitely not visible
  if (checkDate < startDay) return false;

  const taskEnd = task.endDate ? new Date(task.endDate) : taskStart;
  const endDay = endOfDay(taskEnd);
  
  // Duration in days (0 if same day)
  const duration = differenceInCalendarDays(endDay, startDay); 

  // Check based on repeat rule
  switch (task.repeatRule) {
    case 'daily':
      // Daily tasks repeat every day after start date
      // Since it repeats daily, any date >= startDay is valid if we assume infinite repetition
      // But we must respect the duration of each instance.
      // Actually, if it repeats daily, it effectively covers [Start, Infinity)
      return true;

    case 'weekly':
      // Check if the date falls into any weekly instance
      // Instance K starts at startDay + K weeks
      // We need to find K such that instanceStart <= checkDate <= instanceEnd
      // K = floor((checkDate - startDay) / 7)
      // Check K and K-1 to handle overlap if duration > 7 days
      {
        const daysDiff = differenceInCalendarDays(checkDate, startDay);
        const k = Math.floor(daysDiff / 7);
        
        // Check instance K
        if (checkInstance(checkDate, startDay, duration, k, 'week')) return true;
        // Check instance K-1 (for long duration overlap)
        if (k > 0 && checkInstance(checkDate, startDay, duration, k - 1, 'week')) return true;
        
        return false;
      }

    case 'monthly':
      {
        // Monthly is tricky due to variable length.
        // We approximate K based on month difference.
        const monthsDiff = (checkDate.getFullYear() - startDay.getFullYear()) * 12 + (checkDate.getMonth() - startDay.getMonth());
        
        // Check instances around K (K, K-1)
        if (checkInstance(checkDate, startDay, duration, monthsDiff, 'month')) return true;
        if (monthsDiff > 0 && checkInstance(checkDate, startDay, duration, monthsDiff - 1, 'month')) return true;
        
        return false;
      }

    case 'yearly':
      {
        const yearsDiff = checkDate.getFullYear() - startDay.getFullYear();
        
        // Check instances around K
        if (checkInstance(checkDate, startDay, duration, yearsDiff, 'year')) return true;
        if (yearsDiff > 0 && checkInstance(checkDate, startDay, duration, yearsDiff - 1, 'year')) return true;
        
        return false;
      }

    case 'none':
    default:
      // Simple range check for non-repeating tasks
      return checkDate >= startDay && checkDate <= startOfDay(taskEnd);
  }
};

// Helper to check if date falls within a specific instance
const checkInstance = (
  checkDate: Date, 
  startDay: Date, 
  duration: number, 
  k: number, 
  unit: 'week' | 'month' | 'year'
): boolean => {
  let instanceStart: Date;
  
  if (unit === 'week') {
    instanceStart = addWeeks(startDay, k);
  } else if (unit === 'month') {
    instanceStart = addMonths(startDay, k);
  } else {
    instanceStart = addYears(startDay, k);
  }
  
  const instanceEnd = addDays(instanceStart, duration);
  
  // We use startOfDay for comparison to ignore time
  return checkDate >= startOfDay(instanceStart) && checkDate <= startOfDay(instanceEnd);
};
