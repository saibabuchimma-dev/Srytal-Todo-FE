jest.mock('@/features/employee/services/employee.service', () => ({
  getEmployees: jest.fn(),
  getEmployee: jest.fn(),
  getEmployeesPage: jest.fn(),
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
}));

import { renderHook, waitFor, hookWrapper } from '@test-utils';
import * as svc from '@/features/employee/services/employee.service';
import {
  useEmployees,
  usePaginatedEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from '@/features/employee/hooks/useEmployees';

const mocked = svc as jest.Mocked<typeof svc>;

describe('employee hooks', () => {
  it('useEmployees fetches, and honours enabled:false', async () => {
    mocked.getEmployees.mockResolvedValueOnce([] as never);
    const { result } = renderHook(() => useEmployees(), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: off } = renderHook(() => useEmployees({ enabled: false }), hookWrapper());
    expect(off.current.fetchStatus).toBe('idle');
  });

  it('usePaginatedEmployees fetches a page', async () => {
    mocked.getEmployeesPage.mockResolvedValueOnce({ items: [], total: 0, page: 1, limit: 10, totalPages: 1 });
    const { result } = renderHook(() => usePaginatedEmployees({ page: 1, limit: 10 }), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useEmployee fetches with id and stays idle when empty', async () => {
    mocked.getEmployee.mockResolvedValueOnce({ id: 'e1' } as never);
    const { result } = renderHook(() => useEmployee('e1'), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: empty } = renderHook(() => useEmployee(''), hookWrapper());
    expect(empty.current.fetchStatus).toBe('idle');
  });

  it('mutations call their services', async () => {
    mocked.createEmployee.mockResolvedValueOnce({ id: 'e2' } as never);
    mocked.updateEmployee.mockResolvedValueOnce({ id: 'e3' } as never);
    mocked.deleteEmployee.mockResolvedValueOnce();

    const create = renderHook(() => useCreateEmployee(), hookWrapper());
    await create.result.current.mutateAsync({ fullName: 'N', email: 'n@x.com', role: 'Employee', isActive: true });
    expect(mocked.createEmployee).toHaveBeenCalled();

    const update = renderHook(() => useUpdateEmployee(), hookWrapper());
    await update.result.current.mutateAsync({ id: 'e3', payload: { fullName: 'U' } });
    expect(mocked.updateEmployee).toHaveBeenCalledWith('e3', { fullName: 'U' });

    const del = renderHook(() => useDeleteEmployee(), hookWrapper());
    await del.result.current.mutateAsync('e4');
    expect(mocked.deleteEmployee).toHaveBeenCalledWith('e4');
  });
});
