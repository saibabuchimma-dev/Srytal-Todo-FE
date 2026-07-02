export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  EMPLOYEE_DETAILS: (employeeId: number) => `/dashboard/employees/${employeeId}`,
  PROFILE: '/dashboard/profile',
} as const;
