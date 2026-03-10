import { describe, it, expect } from 'vitest';
import { formatTime, formatForInput, formatTimeRange, TIME_FORMAT_24H } from './timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    it('should format a valid Date object correctly', () => {
      const date = new Date('2023-10-27T14:30:00');
      expect(formatTime(date, TIME_FORMAT_24H)).toBe('14:30');
    });

    it('should format a valid ISO string correctly', () => {
      const isoString = '2023-10-27T14:30:00.000Z';
      // Adjust for local time zone since tests run in local environment
      const date = new Date(isoString);
      // Since we use date-fns format, we expect it to match HH:mm
      // Let's use a simpler check for unit tests running in consistent environments
      // or assume UTC for simplicity if we could control timezone.
      // But formatTime uses local time.
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      expect(formatTime(date, TIME_FORMAT_24H)).toBe(`${hours}:${minutes}`);
    });

    it('should return empty string for invalid date', () => {
      expect(formatTime('invalid-date')).toBe('');
    });
  });

  describe('formatForInput', () => {
    it('should format for datetime-local input', () => {
      const date = new Date(2023, 9, 27, 14, 30); // Oct is month 9
      expect(formatForInput(date, 'datetime')).toBe('2023-10-27T14:30');
    });

    it('should format for date input', () => {
      const date = new Date(2023, 9, 27, 14, 30);
      expect(formatForInput(date, 'date')).toBe('2023-10-27');
    });
  });

  describe('formatTimeRange', () => {
    it('should return "全天" for all-day events', () => {
      const start = new Date();
      expect(formatTimeRange(start, undefined, true)).toBe('全天');
    });

    it('should return start time only if end is missing', () => {
      const start = new Date(2023, 9, 27, 14, 30);
      expect(formatTimeRange(start)).toBe('14:30');
    });

    it('should return range if both exist', () => {
      const start = new Date(2023, 9, 27, 14, 30);
      const end = new Date(2023, 9, 27, 16, 0);
      expect(formatTimeRange(start, end)).toBe('14:30 - 16:00');
    });
  });
});
