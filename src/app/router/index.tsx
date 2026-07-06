import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import ChangePasswordScreen from '@/features/auth/screens/ChangePasswordScreen';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import EmployeeDetailsPage from '@/features/employee/screens/EmployeeDetailsPage';
import { EmployeesPage } from '@/features/employee/screens/EmployeesPage';
import ProfilePage from '@/features/profile/screens/ProfilePage';
import ProjectsPage from '@/features/project/screens/ProjectsPage';
import TasksPage from '@/features/task/screens/TasksPage';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginScreen portal="employee" />,
  },
  {
    path: '/admin/login',
    element: <LoginScreen portal="admin" />,
  },
  {
    element: <ProtectedRoute requiredRole="Employee" redirectPath="/login" />,
    children: [
      {
        path: '/change-password',
        element: <ChangePasswordScreen />,
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
            element: <TasksPage />,
          },
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
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
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
