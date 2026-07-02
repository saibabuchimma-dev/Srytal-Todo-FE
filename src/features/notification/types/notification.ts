export type NotificationTone = 'info' | 'warning' | 'success';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  tone: NotificationTone;
  read: boolean;
  createdAt: string;
}
