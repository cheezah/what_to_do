import { format, parseISO, isValid, startOfDay, endOfDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// Constants for time formatting
export const TIME_FORMAT_24H = 'HH:mm';
export const TIME_FORMAT_12H = 'hh:mm a';
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';
export const INPUT_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"; // For datetime-local input
export const INPUT_DATE_FORMAT = "yyyy-MM-dd"; // For date input

/**
 * Format a date object or ISO string to a specific format
 * @param date Date object or ISO string
 * @param formatStr Format string (default: HH:mm)
 * @returns Formatted string or empty string if invalid
 */
export const formatTime = (date: Date | string, formatStr: string = TIME_FORMAT_24H): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr, { locale: zhCN });
};

/**
 * Format a date object or ISO string for input fields (datetime-local or date)
 * @param date Date object or ISO string
 * @param type 'datetime' or 'date'
 * @returns Formatted string for input value
 */
export const formatForInput = (date: Date | string, type: 'datetime' | 'date' = 'datetime'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, type === 'datetime' ? INPUT_DATETIME_FORMAT : INPUT_DATE_FORMAT);
};

/**
 * Format a date range for display
 * @param start Start date
 * @param end End date (optional)
 * @param isAllDay Whether it's an all-day event
 * @returns Formatted range string
 */
export const formatTimeRange = (start: Date | string, end?: Date | string, isAllDay: boolean = false): string => {
  if (isAllDay) return '全天';
  
  const startTime = formatTime(start, TIME_FORMAT_24H);
  if (!end) return startTime;
  
  const endTime = formatTime(end, TIME_FORMAT_24H);
  return `${startTime} - ${endTime}`;
};

/**
 * Get start of day for a given date
 * @param date Date
 * @returns Date object
 */
export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

/**
 * Get end of day for a given date
 * @param date Date
 * @returns Date object
 */
export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};
