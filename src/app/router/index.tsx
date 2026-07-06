import { createBrowserRouter } from 'react-router-dom';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import EmployeeDetailsPage from '@/features/employee/screens/EmployeeDetailsPage';
import ProfilePage from '@/features/profile/screens/ProfilePage';
import ProjectsPage from '@/features/project/screens/ProjectsPage';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginScreen />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardScreen />,
          },
          {
            path: 'employees/:employeeId',
            element: <EmployeeDetailsPage />,
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
