import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { AxiosError } from 'axios';

import {
  addTaskComment,
  deleteTaskComment,
  getTaskComments,
  updateTaskComment,
} from '../services/comment.service';

const commentsKey = (taskId: string) => ['comments', taskId];

const showError = (error: AxiosError<{ message: string }>, fallback: string) => {
  notifications.show({
    color: 'red',
    title: 'Failed',
    message: error.response?.data?.message ?? fallback,
  });
};

export const useTaskComments = (taskId: string) =>
  useQuery({
    queryKey: commentsKey(taskId),
    queryFn: () => getTaskComments(taskId),
    enabled: !!taskId,
  });

export const useAddComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => addTaskComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(taskId) });
    },
    onError: (error: AxiosError<{ message: string }>) =>
      showError(error, 'Unable to add comment.'),
  });
};

export const useUpdateComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateTaskComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(taskId) });
    },
    onError: (error: AxiosError<{ message: string }>) =>
      showError(error, 'Unable to update comment.'),
  });
};

export const useDeleteComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTaskComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(taskId) });
    },
    onError: (error: AxiosError<{ message: string }>) =>
      showError(error, 'Unable to delete comment.'),
  });
};
