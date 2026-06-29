import { createBrowserRouter } from 'react-router-dom';

import LoginScreen from '@/features/auth/screens/LoginScreen';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import MainLayout from '@/layouts/MainLayout/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginScreen />,
  },
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
]);
