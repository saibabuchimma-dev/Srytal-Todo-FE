export type NotificationType = 'TASK_ASSIGNED' | 'TASK_STATUS' | 'COMMENT_ADDED';

export interface NotificationActor {
  id: string;
  fullName: string;
  avatar?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  taskId?: string;
  actor?: NotificationActor;
  createdAt?: string;
}

export interface NotificationApiResponse {
  _id?: string;
  id?: string;
  type?: NotificationType;
  message?: string;
  isRead?: boolean;
  task?: string | { _id: string; title?: string } | null;
  actor?: string | { _id: string; fullName: string; avatar?: string } | null;
  createdAt?: string;
}
