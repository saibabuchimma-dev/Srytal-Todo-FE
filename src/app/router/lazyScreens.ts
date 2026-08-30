import { lazy } from 'react';

export const LoginScreen = lazy(() => import('@/features/auth/screens/LoginScreen'));

export const ChangePasswordScreen = lazy(
  () => import('@/features/auth/screens/ChangePasswordScreen'),
);

export const DashboardScreen = lazy(
  () => import('@/features/dashboard/screens/DashboardScreen'),
);

export const EmployeesPage = lazy(() =>
  import('@/features/employee/screens/EmployeesPage').then((m) => ({
    default: m.EmployeesPage,
  })),
);

export const EmployeeDetailsPage = lazy(
  () => import('@/features/employee/screens/EmployeeDetailsPage'),
);

export const TasksPage = lazy(() => import('@/features/task/screens/TasksPage'));

export const TaskDetailsPage = lazy(
  () => import('@/features/task/screens/TaskDetailsPage'),
);

export const ProjectsPage = lazy(() => import('@/features/project/screens/ProjectsPage'));

export const ProjectDetailsPage = lazy(
  () => import('@/features/project/screens/ProjectDetailsPage'),
);

export const ProfilePage = lazy(() => import('@/features/profile/screens/ProfilePage'));

export const SettingsPage = lazy(() => import('@/features/settings/screens/SettingsPage'));

export const MyTasksPage = lazy(() => import('@/features/task/screens/MyTasksPage'));

export const MyProjectsPage = lazy(
  () => import('@/features/project/screens/MyProjectsPage'),
);

export const TaskBoardPage = lazy(() => import('@/features/task/screens/TaskBoardPage'));

export const ReportsPage = lazy(() => import('@/features/report/screens/ReportsPage'));
