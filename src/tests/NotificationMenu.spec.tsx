const mockNavigate = jest.fn();
const mockMarkRead = jest.fn();
const mockMarkAll = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockUseNotifications = jest.fn();
jest.mock('@/features/notification/hooks/useNotifications', () => ({
  useNotifications: () => mockUseNotifications(),
  useMarkNotificationRead: () => ({ mutate: mockMarkRead }),
  useMarkAllNotificationsRead: () => ({ mutate: mockMarkAll }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import NotificationMenu from '@/features/notification/components/NotificationMenu';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePreferencesStore } from '@/shared/store/preferences.store';

const notifications = [
  { id: 'n1', type: 'TASK_ASSIGNED', message: 'You were assigned', isRead: false, taskId: 't1', createdAt: '2026-01-01' },
  { id: 'n2', type: 'COMMENT_ADDED', message: 'New comment', isRead: true, createdAt: '2026-01-01' },
];

describe('NotificationMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Admin', mustChangePassword: false },
      't',
    );
    usePreferencesStore.setState({ notifications: { taskAssigned: true, statusChanges: true, comments: true } });
    mockUseNotifications.mockReturnValue({ data: notifications });
  });

  it('opens the menu, marks one read and navigates to the task', async () => {
    const u = userEvent.setup();
    renderWithProviders(<NotificationMenu />);
    await u.click(screen.getByLabelText('Notifications'));
    await u.click(await screen.findByText('You were assigned'));
    expect(mockMarkRead).toHaveBeenCalledWith('n1');
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard/tasks/t1');
  });

  it('marks all as read', async () => {
    const u = userEvent.setup();
    renderWithProviders(<NotificationMenu />);
    await u.click(screen.getByLabelText('Notifications'));
    await u.click(await screen.findByLabelText('Mark all as read'));
    expect(mockMarkAll).toHaveBeenCalled();
  });

  it('shows the empty state when there are no notifications', async () => {
    mockUseNotifications.mockReturnValue({ data: [] });
    const u = userEvent.setup();
    renderWithProviders(<NotificationMenu />);
    await u.click(screen.getByLabelText('Notifications'));
    expect(await screen.findByText("You're all caught up.")).toBeInTheDocument();
  });

  it('filters out notification types disabled in preferences', async () => {
    usePreferencesStore.setState({ notifications: { taskAssigned: false, statusChanges: true, comments: true } });
    const u = userEvent.setup();
    renderWithProviders(<NotificationMenu />);
    await u.click(screen.getByLabelText('Notifications'));
    expect(screen.queryByText('You were assigned')).not.toBeInTheDocument();
    expect(await screen.findByText('New comment')).toBeInTheDocument();
  });
});
