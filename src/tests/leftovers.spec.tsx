import { Routes, Route } from 'react-router-dom';
import { render, renderWithProviders, screen, userEvent, act } from '@test-utils';

import { useTaskStore } from '@/features/task/store/task.store';
import EmployeeList from '@/features/employee/components/EmployeeList';
import EmployeeSearch from '@/features/employee/components/EmployeeSearch';
import { MantineProvider } from '@/app/providers/MantineProvider';
import AppProviders from '@/app/providers/AppProviders';
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout';
import { router } from '@/app/router';
import { useAuthStore } from '@/features/auth/store/auth.store';

describe('useTaskStore', () => {
  it('selects and clears a task', () => {
    act(() => useTaskStore.getState().setSelectedTask({ id: 't1' } as never));
    expect(useTaskStore.getState().selectedTask?.id).toBe('t1');
    act(() => useTaskStore.getState().clearSelectedTask());
    expect(useTaskStore.getState().selectedTask).toBeNull();
  });
});

describe('EmployeeList', () => {
  it('renders a card per employee', () => {
    useAuthStore.getState().login({ id: 'u', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false }, 't');
    renderWithProviders(
      <EmployeeList
        employees={[{ id: 'e1', fullName: 'Sravani', email: 's@x.com', role: 'Employee', avatar: '', isActive: true, mustChangePassword: false }]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText('Sravani')).toBeInTheDocument();
  });
});

describe('EmployeeSearch', () => {
  it('fires onChange when typing', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(<EmployeeSearch value="" onChange={onChange} />, { withRouter: false });
    await user.type(screen.getByPlaceholderText('Search employee...'), 'x');
    expect(onChange).toHaveBeenCalledWith('x');
  });
});

describe('providers and layouts', () => {
  it('MantineProvider renders its children', () => {
    render(<MantineProvider><div>mp-child</div></MantineProvider>);
    expect(screen.getByText('mp-child')).toBeInTheDocument();
  });

  it('AppProviders renders its children', () => {
    render(<AppProviders><div>app-child</div></AppProviders>);
    expect(screen.getByText('app-child')).toBeInTheDocument();
  });

  it('DashboardLayout renders an outlet', () => {
    renderWithProviders(
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<div>dash-outlet</div>} />
        </Route>
      </Routes>,
      { route: '/' },
    );
    expect(screen.getByText('dash-outlet')).toBeInTheDocument();
  });

  it('AuthLayout renders an outlet', () => {
    renderWithProviders(
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<div>auth-outlet</div>} />
        </Route>
      </Routes>,
      { route: '/' },
    );
    expect(screen.getByText('auth-outlet')).toBeInTheDocument();
  });
});

describe('router', () => {
  it('is configured with routes', () => {
    expect(router).toBeDefined();
    expect(Array.isArray(router.routes)).toBe(true);
    expect(router.routes.length).toBeGreaterThan(0);
  });
});
