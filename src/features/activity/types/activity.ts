export type ActivityType = 'TASK_CREATED' | 'STATUS_CHANGED' | 'ASSIGNED' | 'COMMENT_ADDED';

export interface ActivityActor {
  id: string;
  fullName: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  actor?: ActivityActor;
  createdAt?: string;
}

export interface ActivityApiResponse {
  _id?: string;
  id?: string;
  type?: ActivityType;
  message?: string;
  actor?: string | { _id: string; fullName: string; avatar?: string } | null;
  createdAt?: string;
}
