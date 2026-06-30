import { createElement, type ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconInfoCircle, IconX, IconAlertTriangle } from '@tabler/icons-react';

interface ToastOptions {
  title?: string;
  message: ReactNode;
  autoClose?: number;
}

const showToast = ({
  title,
  message,
  autoClose,
  color,
  icon,
}: ToastOptions & { color: string; icon: ReactNode }) => {
  notifications.show({
    title,
    message,
    color,
    icon,
    autoClose,
  });
};

export const toast = {
  success: (title: string, message: ReactNode) => {
    showToast({
      title,
      message,
      color: 'green',
      icon: createElement(IconCheck, { size: 18 }),
      autoClose: 3000,
    });
  },

  error: (title: string, message: ReactNode) => {
    showToast({
      title,
      message,
      color: 'red',
      icon: createElement(IconX, { size: 18 }),
      autoClose: 4000,
    });
  },

  warning: (title: string, message: ReactNode) => {
    showToast({
      title,
      message,
      color: 'yellow',
      icon: createElement(IconAlertTriangle, { size: 18 }),
      autoClose: 4000,
    });
  },

  info: (title: string, message: ReactNode) => {
    showToast({
      title,
      message,
      color: 'blue',
      icon: createElement(IconInfoCircle, { size: 18 }),
      autoClose: 3000,
    });
  },
};
