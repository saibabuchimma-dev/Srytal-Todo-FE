const mockUseActivities = jest.fn();
const mockUseAttachments = jest.fn();
const mockUseComments = jest.fn();
jest.mock('@/features/activity/hooks/useActivities', () => ({ useTaskActivities: () => mockUseActivities() }));
jest.mock('@/features/attachment/hooks/useAttachments', () => ({
  useTaskAttachments: () => mockUseAttachments(),
  useUploadAttachment: () => ({ mutate: jest.fn(), isPending: false }),
  useDeleteAttachment: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock('@/features/comment/hooks/useComments', () => ({
  useTaskComments: () => mockUseComments(),
  useAddComment: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateComment: () => ({ mutate: jest.fn(), isPending: false }),
  useDeleteComment: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock('@/features/attachment/services/attachment.service', () => ({ uploadTaskAttachment: jest.fn() }));

import { renderWithProviders, screen } from '@test-utils';
import ActivityTimeline from '@/features/activity/components/ActivityTimeline';
import AttachmentSection from '@/features/attachment/components/AttachmentSection';
import CommentSection from '@/features/comment/components/CommentSection';
import { useAuthStore } from '@/features/auth/store/auth.store';

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.getState().login(
    { id: 'u1', fullName: 'A', name: 'A', email: 'a@x.com', role: 'Employee', mustChangePassword: false },
    't',
  );
});

describe('ActivityTimeline', () => {
  it('renders loading, error, empty and data states', () => {
    mockUseActivities.mockReturnValue({ data: [], isLoading: true });
    const { unmount: u1 } = renderWithProviders(<ActivityTimeline taskId="t1" />, { withRouter: false });
    expect(screen.getByRole('status')).toBeInTheDocument();
    u1();

    mockUseActivities.mockReturnValue({ data: [], isError: true });
    const { unmount: u2 } = renderWithProviders(<ActivityTimeline taskId="t1" />, { withRouter: false });
    expect(screen.getByText('Activity could not be loaded.')).toBeInTheDocument();
    u2();

    mockUseActivities.mockReturnValue({ data: [], isLoading: false });
    const { unmount: u3 } = renderWithProviders(<ActivityTimeline taskId="t1" />, { withRouter: false });
    expect(screen.getByText('No activity yet.')).toBeInTheDocument();
    u3();

    mockUseActivities.mockReturnValue({
      data: [{ id: 'a1', type: 'TASK_CREATED', message: 'created this task', actor: { id: 'u', fullName: 'Sara' }, createdAt: '2026-01-01' }],
      isLoading: false,
    });
    renderWithProviders(<ActivityTimeline taskId="t1" />, { withRouter: false });
    expect(screen.getByText('created this task')).toBeInTheDocument();
    expect(screen.getByText('Sara')).toBeInTheDocument();
  });
});

describe('AttachmentSection', () => {
  it('renders empty and data states', () => {
    mockUseAttachments.mockReturnValue({ data: [], isLoading: false });
    const { unmount } = renderWithProviders(<AttachmentSection taskId="t1" />, { withRouter: false });
    expect(screen.getByText(/No attachments yet/)).toBeInTheDocument();
    unmount();

    mockUseAttachments.mockReturnValue({
      data: [{ id: 'f1', originalName: 'a.pdf', mimeType: 'application/pdf', size: 100, url: 'u', taskId: 't1', uploadedBy: { id: 'u1', fullName: 'A' } }],
      isLoading: false,
    });
    renderWithProviders(<AttachmentSection taskId="t1" />, { withRouter: false });
    expect(screen.getByText('a.pdf')).toBeInTheDocument();
  });
});

describe('CommentSection', () => {
  it('renders empty and data states', () => {
    mockUseComments.mockReturnValue({ data: [], isLoading: false });
    const { unmount } = renderWithProviders(<CommentSection taskId="t1" />, { withRouter: false });
    expect(screen.getByText(/No comments yet/)).toBeInTheDocument();
    unmount();

    mockUseComments.mockReturnValue({
      data: [{ id: 'c1', content: 'Hello', taskId: 't1', author: { id: 'u1', fullName: 'A' }, createdAt: '2026-01-01' }],
      isLoading: false,
    });
    renderWithProviders(<CommentSection taskId="t1" />, { withRouter: false });
    expect(screen.getByText(/Comments \(1\)/)).toBeInTheDocument();
  });
});
