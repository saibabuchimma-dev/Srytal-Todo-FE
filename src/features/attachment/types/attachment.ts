export interface AttachmentUploader {
  id: string;
  fullName: string;
  avatar?: string;
  role?: string;
}

export interface Attachment {
  id: string;
  originalName: string;
  fileName?: string;
  mimeType: string;
  size: number;
  url: string;
  taskId: string;
  uploadedBy?: AttachmentUploader;
  createdAt?: string;
}

export interface AttachmentApiResponse {
  _id?: string;
  id?: string;

  originalName?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  url?: string;

  task?: string | { _id: string } | null;

  uploadedBy?:
    | string
    | {
        _id: string;
        fullName: string;
        avatar?: string;
        role?: string;
      }
    | null;

  createdAt?: string;
}
