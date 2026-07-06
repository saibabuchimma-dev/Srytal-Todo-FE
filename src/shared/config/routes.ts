export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  EMPLOYEE_DETAILS: (employeeId: string) => `/dashboard/employees/${employeeId}`,
  PROJECTS: '/dashboard/projects',
  PROFILE: '/dashboard/profile',
} as const;
