import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import ChangePasswordScreen from '@/features/auth/screens/ChangePasswordScreen';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import { EmployeesPage } from '@/features/employee/screens/EmployeesPage';
import EmployeeDetailsPage from '@/features/employee/screens/EmployeeDetailsPage';
import TasksPage from '@/features/task/screens/TasksPage';
import TaskDetailsPage from '@/features/task/screens/TaskDetailsPage';
import ProjectsPage from '@/features/project/screens/ProjectsPage';
import ProjectDetailsPage from '@/features/project/screens/ProjectDetailsPage';
import ProfilePage from '@/features/profile/screens/ProfilePage';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import MyTasksPage from '@/features/task/screens/MyTasksPage';
import MyProjectsPage from '@/features/project/screens/MyProjectsPage';

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

  // ================= EMPLOYEE =================

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
            element: <MyTasksPage />,
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
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
