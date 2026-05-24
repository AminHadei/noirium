import { describe, it, expect } from 'vite-plus/test';

import {
  formatDuration,
  formatShortDate,
  formatFullTime,
  formatWithAbbreviationTZ,
} from '@/features/shared/lib/utils/date-filters.util';

describe('date-filters', () => {
  describe('formatSessionDate', () => {
    it('should format date as "Wed, Aug 27"', () => {
      const result = formatShortDate('2025-08-27T00:00:00Z');
      expect(result).toMatch(/Wed, Aug 27/);
    });

    it('should handle different date formats', () => {
      expect(formatShortDate('2025-01-01T00:00:00Z')).toMatch(/Jan 1/);
      expect(formatShortDate(new Date('2025-12-25T00:00:00Z'))).toMatch(/Dec 25/);
      expect(formatShortDate(new Date('2025-12-25T00:00:00Z').getTime())).toMatch(/Dec 25/);
    });
  });

  describe('formatSessionTime', () => {
    it('should handle invalid time', () => {
      const result = formatFullTime('invalid');
      expect(result).toBe('Invalid Date');
    });

    it('should format time as "2:00 PM"', () => {
      const result = formatFullTime('2025-08-27T14:00:00Z');
      // Should match format: "2:00 PM +03:30" or "5:00 PM +00:00" (depending on local timezone)
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM) [+-]\d{2}:\d{2}/);
    });

    it('should handle midnight and noon correctly', () => {
      // Should include AM/PM and timezone offset
      expect(formatFullTime('2025-08-27T00:00:00Z')).toMatch(/\d{1,2}:\d{2} AM [+-]\d{2}:\d{2}/);
      expect(formatFullTime('2025-08-27T12:00:00Z')).toMatch(/\d{1,2}:\d{2} PM [+-]\d{2}:\d{2}/);
    });
  });

  describe('formatDuration', () => {
    it('should return empty string if duration is invalid', () => {
      expect(formatDuration('')).toBe('');
      expect(formatDuration('invalid')).toBe('');
    });

    it('should format hours correctly', () => {
      expect(formatDuration('01:00:00')).toBe('1h');
      expect(formatDuration('02:00:00')).toBe('2h');
      expect(formatDuration('03:00:00')).toBe('3h');
    });

    it('should format minutes correctly', () => {
      expect(formatDuration('00:30:00')).toBe('30min');
      expect(formatDuration('00:45:00')).toBe('45min');
      expect(formatDuration('00:90:00')).toBe('90min');
    });

    it('should handle edge cases', () => {
      expect(formatDuration('00:00:00')).toBe('0min');
      expect(formatDuration('00:01:00')).toBe('1min');
    });
  });

  describe('formatWithAbbreviationTZ', () => {
    it('should return correct abbreviation for not USA', () => {
      process.env.TZ = 'Asia/Istanbul';
      const tz = formatWithAbbreviationTZ('2025-08-27T00:00:00Z');
      expect(tz).toEqual('3:00 AM +03:00');
    });

    it('should return correct abbreviation for USA', () => {
      process.env.TZ = 'America/New_York';
      const tz = formatWithAbbreviationTZ('2025-08-27T00:00:00Z');
      expect(tz).toEqual('8:00 PM EDT');
    });
  });
});
