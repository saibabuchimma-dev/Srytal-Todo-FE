jest.mock('@/shared/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '@/shared/services/api';
import {
  getEmployees,
  getEmployeesPage,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/features/employee/services/employee.service';

const mockApi = api as unknown as Record<'get' | 'post' | 'put' | 'delete', jest.Mock>;

describe('employee.service', () => {
  it('getEmployees normalizes a bare array', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ _id: 'e1', fullName: 'A', email: 'a@x.com', role: 'Admin', isActive: false }],
    });
    const result = await getEmployees();
    expect(mockApi.get).toHaveBeenCalledWith('/employees');
    expect(result[0]).toMatchObject({ id: 'e1', fullName: 'A', role: 'Admin', isActive: false });
  });

  it('getEmployees normalizes a { data: [...] } envelope and applies defaults', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [{ id: 'e2' }] } });
    const [emp] = await getEmployees();
    expect(emp).toMatchObject({ id: 'e2', role: 'Employee', isActive: true, mustChangePassword: false });
  });

  it('getEmployees returns [] for an unexpected shape', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { nope: true } });
    expect(await getEmployees()).toEqual([]);
  });

  it('getEmployeesPage maps the paginated envelope', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { employees: [{ _id: 'e3' }], total: 1, page: 2, limit: 5, totalPages: 1 },
    });
    const page = await getEmployeesPage({ page: 2, limit: 5 });
    expect(mockApi.get).toHaveBeenCalledWith('/employees/search', { params: { page: 2, limit: 5 } });
    expect(page).toMatchObject({ total: 1, page: 2, limit: 5, totalPages: 1 });
    expect(page.items[0].id).toBe('e3');
  });

  it('getEmployeesPage falls back to params when fields are missing', async () => {
    mockApi.get.mockResolvedValueOnce({ data: {} });
    const page = await getEmployeesPage({ page: 3, limit: 20 });
    expect(page).toEqual({ items: [], total: 0, page: 3, limit: 20, totalPages: 1 });
  });

  it('getEmployee unwraps a { data } envelope', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: { _id: 'e4', fullName: 'D' } } });
    expect(await getEmployee('e4')).toMatchObject({ id: 'e4', fullName: 'D' });
    expect(mockApi.get).toHaveBeenCalledWith('/employees/e4');
  });

  it('getEmployee accepts a raw object', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { _id: 'e5' } });
    expect((await getEmployee('e5')).id).toBe('e5');
  });

  it('createEmployee posts and normalizes', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: { _id: 'e6' } } });
    const created = await createEmployee({ fullName: 'N', email: 'n@x.com', role: 'Employee', isActive: true });
    expect(mockApi.post).toHaveBeenCalledWith('/employees', expect.objectContaining({ fullName: 'N' }));
    expect(created.id).toBe('e6');
  });

  it('updateEmployee puts and normalizes a raw response', async () => {
    mockApi.put.mockResolvedValueOnce({ data: { _id: 'e7', fullName: 'U' } });
    const updated = await updateEmployee('e7', { fullName: 'U' });
    expect(mockApi.put).toHaveBeenCalledWith('/employees/e7', { fullName: 'U' });
    expect(updated.fullName).toBe('U');
  });

  it('deleteEmployee calls DELETE', async () => {
    mockApi.delete.mockResolvedValueOnce({});
    await deleteEmployee('e8');
    expect(mockApi.delete).toHaveBeenCalledWith('/employees/e8');
  });
});
