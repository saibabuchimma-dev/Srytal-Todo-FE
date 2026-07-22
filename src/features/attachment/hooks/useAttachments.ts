import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { AxiosError } from 'axios';

import {
  deleteTaskAttachment,
  getTaskAttachments,
  uploadTaskAttachment,
} from '../services/attachment.service';

const attachmentsKey = (taskId: string) => ['attachments', taskId];

const showError = (error: AxiosError<{ message: string }>, fallback: string) => {
  notifications.show({
    color: 'red',
    title: 'Failed',
    message: error.response?.data?.message ?? fallback,
  });
};

export const useTaskAttachments = (taskId: string) =>
  useQuery({
    queryKey: attachmentsKey(taskId),
    queryFn: () => getTaskAttachments(taskId),
    enabled: !!taskId,
  });

export const useUploadAttachment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadTaskAttachment(taskId, file),
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Uploaded',
        message: 'File uploaded successfully.',
      });
      queryClient.invalidateQueries({ queryKey: attachmentsKey(taskId) });
    },
    onError: (error: AxiosError<{ message: string }>) =>
      showError(error, 'Unable to upload file.'),
  });
};

export const useDeleteAttachment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTaskAttachment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attachmentsKey(taskId) });
    },
    onError: (error: AxiosError<{ message: string }>) =>
      showError(error, 'Unable to delete attachment.'),
  });
};
