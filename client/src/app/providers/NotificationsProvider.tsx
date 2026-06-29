import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

type NotificationProviderProps = {
  children: ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <>
      <Notifications />
      {children}
    </>
  );
}
