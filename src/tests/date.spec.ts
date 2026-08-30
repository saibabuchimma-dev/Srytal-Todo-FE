import { fromNow, formatDate, formatDateTime, toDateInputValue } from '@/shared/utils/date';
import { usePreferencesStore } from '@/shared/store/preferences.store';

describe('date utils', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ timezone: 'UTC' });
  });

  describe('fromNow', () => {
    it('returns empty string for missing/invalid values', () => {
      expect(fromNow()).toBe('');
      expect(fromNow('not-a-date')).toBe('');
    });

    it('produces a relative suffix for a past date', () => {
      const past = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(fromNow(past)).toMatch(/ago/);
    });
  });

  describe('formatDate / formatDateTime', () => {
    it('returns empty string for missing values', () => {
      expect(formatDate()).toBe('');
      expect(formatDateTime()).toBe('');
    });

    it('formats a valid date in en-GB style', () => {
      expect(formatDate('2026-07-21T10:00:00Z')).toMatch(/\d{2}\s\w{3}\s\d{4}/);
      expect(formatDateTime('2026-07-21T10:00:00Z')).toMatch(/\d{2}\s\w{3}\s\d{4}/);
    });

    it('falls back to date-fns formatting when the timezone is invalid', () => {
      usePreferencesStore.setState({ timezone: 'Invalid/Zone' });
      expect(formatDate('2026-07-21T10:00:00Z')).toMatch(/\d{2}\s\w{3}\s\d{4}/);
      expect(formatDateTime('2026-07-21T10:00:00Z')).toMatch(/\d{2}\s\w{3}\s\d{4}/);
    });
  });

  describe('toDateInputValue', () => {
    it('returns empty string for missing values', () => {
      expect(toDateInputValue()).toBe('');
    });

    it('returns yyyy-MM-dd for a valid date', () => {
      expect(toDateInputValue('2026-07-21T10:00:00Z')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
