import { toast as sonner } from 'sonner';
import type { ReactNode } from 'react';

export const toast = {
  success: (title: string, message?: ReactNode) => sonner.success(title, { description: message }),

  error: (title: string, message?: ReactNode) => sonner.error(title, { description: message }),

  warning: (title: string, message?: ReactNode) => sonner.warning(title, { description: message }),

  info: (title: string, message?: ReactNode) => sonner.info(title, { description: message }),
};
