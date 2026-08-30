jest.mock('@/features/task/services/taskStatus.service', () => ({
  updateTaskStatus: jest.fn(),
}));
jest.mock('@/shared/utils/toast', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor, hookWrapper } from '@test-utils';
import { updateTaskStatus } from '@/features/task/services/taskStatus.service';
import { toast } from '@/shared/utils/toast';
import { useUpdateTaskStatus } from '@/features/task/hooks/useUpdateTaskStatus';

const mockUpdate = updateTaskStatus as jest.Mock;
const mockToast = toast as unknown as { success: jest.Mock; error: jest.Mock };

// A client that keeps cached data around (gcTime Infinity) so the optimistic
// snapshot survives long enough to assert on, even without an active observer.
const persistentClient = () =>
  new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity, retry: false }, mutations: { retry: false } },
  });
const wrap = (client: QueryClient) => ({
  wrapper: ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  ),
});

describe('useUpdateTaskStatus', () => {
  it('optimistically updates the cached list and toasts on success', async () => {
    mockUpdate.mockResolvedValueOnce({ _id: 't1', status: 'Completed' });
    const client = persistentClient();
    client.setQueryData(['tasks'], [{ id: 't1', status: 'Pending' }, { id: 't2', status: 'Pending' }]);

    const { result } = renderHook(() => useUpdateTaskStatus(), wrap(client));
    await result.current.mutateAsync({ id: 't1', status: 'Completed' });

    await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith('Task status updated'));
    // optimistic write happened during onMutate
    const cached = client.getQueryData(['tasks']) as Array<{ id: string; status: string }>;
    expect(cached.find((t) => t.id === 't1')?.status).toBe('Completed');
  });

  it('rolls back and toasts a server message on error', async () => {
    mockUpdate.mockRejectedValueOnce({ response: { data: { message: 'Denied' } } });
    const client = persistentClient();
    client.setQueryData(['my-tasks'], [{ id: 't9', status: 'Pending' }]);

    const { result } = renderHook(() => useUpdateTaskStatus(), wrap(client));
    await expect(
      result.current.mutateAsync({ id: 't9', status: 'Completed' }),
    ).rejects.toBeDefined();

    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith('Denied'));
    const cached = client.getQueryData(['my-tasks']) as Array<{ id: string; status: string }>;
    expect(cached[0].status).toBe('Pending'); // rolled back
  });

  it('uses the fallback error message when none is provided', async () => {
    mockUpdate.mockRejectedValueOnce({});
    const { result } = renderHook(() => useUpdateTaskStatus(), hookWrapper());
    await expect(result.current.mutateAsync({ id: 'x', status: 'Pending' })).rejects.toBeDefined();
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith('Unable to update task status.'));
  });
});
