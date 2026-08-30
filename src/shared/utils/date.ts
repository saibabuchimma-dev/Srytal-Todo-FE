import { format, formatDistanceToNow } from 'date-fns';

import { usePreferencesStore } from '@/shared/store/preferences.store';

const toDate = (value?: string | number | Date): Date | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const activeTimezone = (): string | undefined => {
  try {
    return usePreferencesStore.getState().timezone || undefined;
  } catch {
    return undefined;
  }
};

/** Relative time, e.g. "about 2 hours ago" (timezone-independent). */
export const fromNow = (value?: string | number | Date): string => {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : '';
};

/** Absolute timestamp in the user's preferred timezone, e.g. "21 Jul 2026, 14:30". */
export const formatDateTime = (value?: string | number | Date): string => {
  const date = toDate(value);
  if (!date) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: activeTimezone(),
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return format(date, 'dd MMM yyyy, HH:mm');
  }
};

/** Absolute date in the user's preferred timezone, e.g. "21 Jul 2026". */
export const formatDate = (value?: string | number | Date): string => {
  const date = toDate(value);
  if (!date) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: activeTimezone(),
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return format(date, 'dd MMM yyyy');
  }
};

/** Value for @mantine/dates inputs (string, "yyyy-MM-dd", local). */
export const toDateInputValue = (value?: string | number | Date): string => {
  const date = toDate(value);
  return date ? format(date, 'yyyy-MM-dd') : '';
};
