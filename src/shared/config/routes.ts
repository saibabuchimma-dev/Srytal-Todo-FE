export const ROUTES = {
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin/login',

  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',

  CHANGE_PASSWORD: '/change-password',

  EMPLOYEES: '/admin/dashboard/employees',
  EMPLOYEE_DETAILS: (employeeId: string) => `/admin/dashboard/employees/${employeeId}`,

  TASKS: '/admin/dashboard/tasks',
  TASK_DETAILS: (taskId: string) => `/dashboard/tasks/${taskId}`,
  ADMIN_TASK_DETAILS: (taskId: string) => `/admin/dashboard/tasks/${taskId}`,

  PROJECTS: '/admin/dashboard/projects',

  PROFILE: '/admin/dashboard/profile',
} as const;
