jest.mock('@/features/profile/services/profile.service', () => ({
  getProfile: jest.fn(),
  updateMyProfile: jest.fn(),
}));
jest.mock('@/features/notification/services/notification.service', () => ({
  getNotifications: jest.fn(),
  markNotificationRead: jest.fn(),
  markAllNotificationsRead: jest.fn(),
}));
jest.mock('@/features/comment/services/comment.service', () => ({
  getTaskComments: jest.fn(),
  addTaskComment: jest.fn(),
  updateTaskComment: jest.fn(),
  deleteTaskComment: jest.fn(),
}));
jest.mock('@/features/attachment/services/attachment.service', () => ({
  getTaskAttachments: jest.fn(),
  uploadTaskAttachment: jest.fn(),
  deleteTaskAttachment: jest.fn(),
}));
jest.mock('@/features/activity/services/activity.service', () => ({
  getTaskActivities: jest.fn(),
}));
jest.mock('@/shared/utils/toast', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { renderHook, waitFor, hookWrapper } from '@test-utils';
import { toast } from '@/shared/utils/toast';
import * as profileSvc from '@/features/profile/services/profile.service';
import * as notifSvc from '@/features/notification/services/notification.service';
import * as commentSvc from '@/features/comment/services/comment.service';
import * as attachSvc from '@/features/attachment/services/attachment.service';
import * as activitySvc from '@/features/activity/services/activity.service';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks/useProfile';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/notification/hooks/useNotifications';
import {
  useTaskComments,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
} from '@/features/comment/hooks/useComments';
import {
  useTaskAttachments,
  useUploadAttachment,
  useDeleteAttachment,
} from '@/features/attachment/hooks/useAttachments';
import { useTaskActivities } from '@/features/activity/hooks/useActivities';
import { useAuthStore } from '@/features/auth/store/auth.store';

const mToast = toast as unknown as { success: jest.Mock; error: jest.Mock };

describe('profile hooks', () => {
  it('useProfile fetches', async () => {
    (profileSvc.getProfile as jest.Mock).mockResolvedValueOnce({ id: 'u1', name: 'A' });
    const { result } = renderHook(() => useProfile(), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useUpdateProfile updates the auth store + toasts on success', async () => {
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'Old', name: 'Old', email: 'a@x.com', role: 'Employee', mustChangePassword: false },
      't',
    );
    (profileSvc.updateMyProfile as jest.Mock).mockResolvedValueOnce({ name: 'New', avatar: 'x' });
    const { result } = renderHook(() => useUpdateProfile(), hookWrapper());
    await result.current.mutateAsync({ name: 'New' });
    await waitFor(() => expect(mToast.success).toHaveBeenCalledWith('Profile updated'));
    expect(useAuthStore.getState().user?.name).toBe('New');
  });

  it('useUpdateProfile toasts server error message', async () => {
    (profileSvc.updateMyProfile as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Bad' } } });
    const { result } = renderHook(() => useUpdateProfile(), hookWrapper());
    await expect(result.current.mutateAsync({ name: 'X' })).rejects.toBeDefined();
    await waitFor(() => expect(mToast.error).toHaveBeenCalledWith('Bad'));
  });
});

describe('notification hooks', () => {
  it('fetches and mutates', async () => {
    (notifSvc.getNotifications as jest.Mock).mockResolvedValueOnce([]);
    const list = renderHook(() => useNotifications(), hookWrapper());
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    (notifSvc.markNotificationRead as jest.Mock).mockResolvedValueOnce(undefined);
    const one = renderHook(() => useMarkNotificationRead(), hookWrapper());
    await one.result.current.mutateAsync('n1');
    expect(notifSvc.markNotificationRead).toHaveBeenCalledWith('n1');

    (notifSvc.markAllNotificationsRead as jest.Mock).mockResolvedValueOnce(undefined);
    const all = renderHook(() => useMarkAllNotificationsRead(), hookWrapper());
    await all.result.current.mutateAsync();
    expect(notifSvc.markAllNotificationsRead).toHaveBeenCalled();
  });
});

describe('comment hooks', () => {
  it('fetches and mutates with success + error paths', async () => {
    (commentSvc.getTaskComments as jest.Mock).mockResolvedValueOnce([]);
    const list = renderHook(() => useTaskComments('t1'), hookWrapper());
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    (commentSvc.addTaskComment as jest.Mock).mockResolvedValueOnce({ id: 'c1' });
    const add = renderHook(() => useAddComment('t1'), hookWrapper());
    await add.result.current.mutateAsync('hi');
    expect(commentSvc.addTaskComment).toHaveBeenCalledWith('t1', 'hi');

    (commentSvc.addTaskComment as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'no' } } });
    const addErr = renderHook(() => useAddComment('t1'), hookWrapper());
    await expect(addErr.result.current.mutateAsync('x')).rejects.toBeDefined();
    await waitFor(() => expect(mToast.error).toHaveBeenCalledWith('no'));

    (commentSvc.updateTaskComment as jest.Mock).mockResolvedValueOnce({ id: 'c1' });
    const upd = renderHook(() => useUpdateComment('t1'), hookWrapper());
    await upd.result.current.mutateAsync({ id: 'c1', content: 'edit' });
    expect(commentSvc.updateTaskComment).toHaveBeenCalled();

    (commentSvc.deleteTaskComment as jest.Mock).mockResolvedValueOnce(undefined);
    const del = renderHook(() => useDeleteComment('t1'), hookWrapper());
    await del.result.current.mutateAsync('c1');
    expect(commentSvc.deleteTaskComment).toHaveBeenCalledWith('c1');

    // fallback error message branch
    (commentSvc.updateTaskComment as jest.Mock).mockRejectedValueOnce({});
    const updErr = renderHook(() => useUpdateComment('t1'), hookWrapper());
    await expect(updErr.result.current.mutateAsync({ id: 'c1', content: 'z' })).rejects.toBeDefined();
    await waitFor(() => expect(mToast.error).toHaveBeenCalledWith('Unable to update comment.'));
  });
});

describe('attachment hooks', () => {
  it('fetches and mutates with success + error', async () => {
    (attachSvc.getTaskAttachments as jest.Mock).mockResolvedValueOnce([]);
    const list = renderHook(() => useTaskAttachments('t1'), hookWrapper());
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    (attachSvc.uploadTaskAttachment as jest.Mock).mockResolvedValueOnce({ id: 'f1' });
    const up = renderHook(() => useUploadAttachment('t1'), hookWrapper());
    await up.result.current.mutateAsync(new File(['a'], 'a.txt'));
    await waitFor(() => expect(mToast.success).toHaveBeenCalledWith('File uploaded'));

    (attachSvc.deleteTaskAttachment as jest.Mock).mockResolvedValueOnce(undefined);
    const del = renderHook(() => useDeleteAttachment('t1'), hookWrapper());
    await del.result.current.mutateAsync('f1');
    expect(attachSvc.deleteTaskAttachment).toHaveBeenCalledWith('f1');

    (attachSvc.deleteTaskAttachment as jest.Mock).mockRejectedValueOnce({});
    const delErr = renderHook(() => useDeleteAttachment('t1'), hookWrapper());
    await expect(delErr.result.current.mutateAsync('f1')).rejects.toBeDefined();
    await waitFor(() => expect(mToast.error).toHaveBeenCalledWith('Unable to delete attachment.'));
  });
});

describe('activity hooks', () => {
  it('useTaskActivities fetches and is gated by id', async () => {
    (activitySvc.getTaskActivities as jest.Mock).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useTaskActivities('t1'), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const off = renderHook(() => useTaskActivities(''), hookWrapper());
    expect(off.result.current.fetchStatus).toBe('idle');
  });
});
