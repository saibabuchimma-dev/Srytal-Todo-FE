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

export const fromNow = (value?: string | number | Date): string => {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : '';
};

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

export const toDateInputValue = (value?: string | number | Date): string => {
  const date = toDate(value);
  return date ? format(date, 'yyyy-MM-dd') : '';
};
