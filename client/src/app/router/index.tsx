import { createBrowserRouter } from 'react-router-dom';

import LoginScreen from '@/features/auth/screens/LoginScreen';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
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
        ],
      },
    ],
  },
]);
