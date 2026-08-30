import { Suspense, type ReactElement } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import {
  ChangePasswordScreen,
  DashboardScreen,
  EmployeeDetailsPage,
  EmployeesPage,
  LoginScreen,
  MyProjectsPage,
  MyTasksPage,
  ProfilePage,
  ProjectDetailsPage,
  ProjectsPage,
  ReportsPage,
  SettingsPage,
  TaskBoardPage,
  TaskDetailsPage,
  TasksPage,
} from './lazyScreens';

// Screens rendered outside MainLayout (login / change-password) need their own
// Suspense boundary; screens inside MainLayout share the one around its Outlet.
const withSuspense = (element: ReactElement): ReactElement => (
  <Suspense fallback={<CenteredState variant="loading" minHeight="100vh" />}>
    {element}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  {
    path: '/login',
    element: withSuspense(<LoginScreen portal="employee" />),
  },

  {
    path: '/admin/login',
    element: withSuspense(<LoginScreen portal="admin" />),
  },

  // ================= EMPLOYEE =================

  {
    element: <ProtectedRoute requiredRole="Employee" redirectPath="/login" />,
    children: [
      {
        path: '/change-password',
        element: withSuspense(<ChangePasswordScreen />),
      },
      {
        path: '/dashboard',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardScreen />,
          },
          {
            path: 'tasks',
            element: <MyTasksPage />,
          },
          {
            path: 'board',
            element: <TaskBoardPage />,
          },
          {
            path: 'tasks/:taskId',
            element: <TaskDetailsPage />,
          },
          {
            path: 'projects',
            element: <MyProjectsPage />,
          },
          {
            path: 'projects/:projectId/details',
            element: <ProjectDetailsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  // ================= ADMIN =================

  {
    element: <ProtectedRoute requiredRole="Admin" redirectPath="/admin/login" />,
    children: [
      {
        path: '/admin/dashboard',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardScreen />,
          },
          {
            path: 'employees',
            element: <EmployeesPage />,
          },
          {
            path: 'employees/:employeeId',
            element: <EmployeeDetailsPage />,
          },
          {
            path: 'tasks',
            element: <TasksPage />,
          },
          {
            path: 'board',
            element: <TaskBoardPage />,
          },
          {
            path: 'tasks/:taskId',
            element: <TaskDetailsPage />,
          },
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'projects/:projectId/details',
            element: <ProjectDetailsPage />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);
