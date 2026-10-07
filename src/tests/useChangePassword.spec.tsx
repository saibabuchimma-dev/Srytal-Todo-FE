jest.mock('@/features/auth/services/auth.service', () => ({
  __esModule: true,
  changePassword: jest.fn(),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useChangePassword } from '@/shared/hooks/useChangePassword';
import { changePassword } from '@/features/auth/services/auth.service';
import { ReactNode } from 'react';

const mockChangePassword = changePassword as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useChangePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a mutation function', () => {
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    });
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });

  it('calls changePassword with the payload', async () => {
    mockChangePassword.mockResolvedValueOnce({ success: true });
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      currentPassword: 'old',
      newPassword: 'new',
      confirmPassword: 'new',
    });

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'old',
        newPassword: 'new',
        confirmPassword: 'new',
      });
    });
  });

  it('tracks mutation state', async () => {
    let resolveMutation: (value: { success: true }) => void;
    const mutationPromise = new Promise<{ success: true }>((resolve) => {
      resolveMutation = resolve;
    });
    mockChangePassword.mockReturnValueOnce(mutationPromise);

    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    result.current.mutate({
      currentPassword: 'old',
      newPassword: 'new',
      confirmPassword: 'new',
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveMutation!({ success: true });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('handles mutation error', async () => {
    mockChangePassword.mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      currentPassword: 'old',
      newPassword: 'new',
      confirmPassword: 'new',
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });
});
