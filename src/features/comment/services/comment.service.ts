import api from '@/shared/services/api';
import type { CommentApiResponse, TaskComment } from '../types/comment';

const normalizeComment = (item: CommentApiResponse): TaskComment => ({
  id: String(item._id ?? item.id ?? ''),
  content: item.content ?? '',
  taskId:
    typeof item.task === 'string' ? item.task : (item.task?._id ?? ''),
  author:
    item.author && typeof item.author === 'object'
      ? {
          id: item.author._id,
          fullName: item.author.fullName,
          email: item.author.email,
          role: item.author.role,
          avatar: item.author.avatar,
        }
      : undefined,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
  const { data } = await api.get<{
    success: boolean;
    data: CommentApiResponse[];
  }>(`/comments/task/${taskId}`);

  return (data.data ?? []).map(normalizeComment);
};

export const addTaskComment = async (taskId: string, content: string): Promise<TaskComment> => {
  const { data } = await api.post<{
    success: boolean;
    data: CommentApiResponse;
  }>(`/comments/task/${taskId}`, { content });

  return normalizeComment(data.data);
};

export const updateTaskComment = async (
  commentId: string,
  content: string,
): Promise<TaskComment> => {
  const { data } = await api.patch<{
    success: boolean;
    data: CommentApiResponse;
  }>(`/comments/${commentId}`, { content });

  return normalizeComment(data.data);
};

export const deleteTaskComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};
