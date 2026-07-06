export const ROUTES = {
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin/login',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  CHANGE_PASSWORD: '/change-password',
  EMPLOYEES: '/admin/dashboard/employees',
  EMPLOYEE_DETAILS: (employeeId: string) => `/admin/dashboard/employees/${employeeId}`,
  PROJECTS: '/admin/dashboard/projects',
  PROFILE: '/admin/dashboard/profile',
} as const;
