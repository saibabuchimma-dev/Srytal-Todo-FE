export const ROUTES = {
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin/login',

  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',

  CHANGE_PASSWORD: '/change-password',

  // Employee
  TASKS: '/dashboard/tasks',
  BOARD: '/dashboard/board',
  PROJECTS: '/dashboard/projects',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',

  // Admin
  EMPLOYEES: '/admin/dashboard/employees',
  EMPLOYEE_DETAILS: (id: string) => `/admin/dashboard/employees/${id}`,

  ADMIN_TASKS: '/admin/dashboard/tasks',
  ADMIN_BOARD: '/admin/dashboard/board',
  ADMIN_PROJECTS: '/admin/dashboard/projects',
  ADMIN_REPORTS: '/admin/dashboard/reports',
  ADMIN_PROFILE: '/admin/dashboard/profile',
  ADMIN_SETTINGS: '/admin/dashboard/settings',

  TASK_DETAILS: (id: string) => `/dashboard/tasks/${id}`,
  ADMIN_TASK_DETAILS: (id: string) => `/admin/dashboard/tasks/${id}`,

  PROJECT_DETAILS: (id: string) => `/dashboard/projects/${id}/details`,
  ADMIN_PROJECT_DETAILS: (id: string) => `/admin/dashboard/projects/${id}/details`,
} as const;
