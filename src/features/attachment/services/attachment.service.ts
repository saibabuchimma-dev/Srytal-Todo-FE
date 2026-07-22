import api from '@/shared/services/api';
import type { Attachment, AttachmentApiResponse } from '../types/attachment';

const normalizeAttachment = (item: AttachmentApiResponse): Attachment => ({
  id: String(item._id ?? item.id ?? ''),
  originalName: item.originalName ?? 'file',
  fileName: item.fileName,
  mimeType: item.mimeType ?? '',
  size: item.size ?? 0,
  url: item.url ?? '',
  taskId: typeof item.task === 'string' ? item.task : (item.task?._id ?? ''),
  uploadedBy:
    item.uploadedBy && typeof item.uploadedBy === 'object'
      ? {
          id: item.uploadedBy._id,
          fullName: item.uploadedBy.fullName,
          avatar: item.uploadedBy.avatar,
          role: item.uploadedBy.role,
        }
      : undefined,
  createdAt: item.createdAt,
});

export const getTaskAttachments = async (taskId: string): Promise<Attachment[]> => {
  const { data } = await api.get<{
    success: boolean;
    data: AttachmentApiResponse[];
  }>(`/attachments/task/${taskId}`);

  return (data.data ?? []).map(normalizeAttachment);
};

export const uploadTaskAttachment = async (taskId: string, file: File): Promise<Attachment> => {
  const form = new FormData();
  form.append('file', file);

  const { data } = await api.post<{
    success: boolean;
    data: AttachmentApiResponse;
  }>(`/attachments/task/${taskId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return normalizeAttachment(data.data);
};

export const deleteTaskAttachment = async (attachmentId: string): Promise<void> => {
  await api.delete(`/attachments/${attachmentId}`);
};
