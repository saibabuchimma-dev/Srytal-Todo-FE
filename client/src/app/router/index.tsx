import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { MainLayout } from '../../layouts/MainLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { EmployeesPage } from '../../features/employee/screens/EmployeesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <EmployeesPage /> },
      { path: 'employees', element: <EmployeesPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
