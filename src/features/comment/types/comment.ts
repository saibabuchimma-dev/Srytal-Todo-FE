export interface CommentAuthor {
  id: string;
  fullName: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  author?: CommentAuthor;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentApiResponse {
  _id?: string;
  id?: string;

  content?: string;

  task?: string | { _id: string } | null;

  author?:
    | string
    | {
        _id: string;
        fullName: string;
        email?: string;
        role?: string;
        avatar?: string;
      }
    | null;

  createdAt?: string;
  updatedAt?: string;
}
