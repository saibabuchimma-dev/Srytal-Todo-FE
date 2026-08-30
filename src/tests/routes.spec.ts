import { ROUTES } from '@/shared/config/routes';

describe('ROUTES', () => {
  it('exposes the expected static paths', () => {
    expect(ROUTES.LOGIN).toBe('/login');
    expect(ROUTES.ADMIN_LOGIN).toBe('/admin/login');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
    expect(ROUTES.ADMIN_DASHBOARD).toBe('/admin/dashboard');
    expect(ROUTES.CHANGE_PASSWORD).toBe('/change-password');
    expect(ROUTES.TASKS).toBe('/dashboard/tasks');
    expect(ROUTES.BOARD).toBe('/dashboard/board');
    expect(ROUTES.PROJECTS).toBe('/dashboard/projects');
    expect(ROUTES.PROFILE).toBe('/dashboard/profile');
    expect(ROUTES.SETTINGS).toBe('/dashboard/settings');
    expect(ROUTES.EMPLOYEES).toBe('/admin/dashboard/employees');
    expect(ROUTES.ADMIN_TASKS).toBe('/admin/dashboard/tasks');
    expect(ROUTES.ADMIN_BOARD).toBe('/admin/dashboard/board');
    expect(ROUTES.ADMIN_PROJECTS).toBe('/admin/dashboard/projects');
    expect(ROUTES.ADMIN_REPORTS).toBe('/admin/dashboard/reports');
    expect(ROUTES.ADMIN_PROFILE).toBe('/admin/dashboard/profile');
    expect(ROUTES.ADMIN_SETTINGS).toBe('/admin/dashboard/settings');
  });

  it('builds dynamic paths from ids', () => {
    expect(ROUTES.EMPLOYEE_DETAILS('e1')).toBe('/admin/dashboard/employees/e1');
    expect(ROUTES.TASK_DETAILS('t1')).toBe('/dashboard/tasks/t1');
    expect(ROUTES.ADMIN_TASK_DETAILS('t1')).toBe('/admin/dashboard/tasks/t1');
    expect(ROUTES.PROJECT_DETAILS('p1')).toBe('/dashboard/projects/p1/details');
    expect(ROUTES.ADMIN_PROJECT_DETAILS('p1')).toBe('/admin/dashboard/projects/p1/details');
  });
});
