jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { patch: jest.fn() },
}));

import api from '@/shared/services/api';
import { updateTaskStatus } from '@/features/task/services/taskStatus.service';

const mockApi = api as unknown as { patch: jest.Mock };

describe('taskStatus.service', () => {
  it('PATCHes the status endpoint and returns the data', async () => {
    mockApi.patch.mockResolvedValueOnce({ data: { data: { _id: 't1', status: 'Completed' } } });
    const result = await updateTaskStatus('t1', 'Completed');
    expect(mockApi.patch).toHaveBeenCalledWith('/tasks/t1/status', { status: 'Completed' });
    expect(result).toEqual({ _id: 't1', status: 'Completed' });
  });
});
