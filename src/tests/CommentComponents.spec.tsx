const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
jest.mock('@/features/comment/hooks/useComments', () => ({
  useAddComment: () => ({ mutate: mockAdd, isPending: false }),
  useUpdateComment: () => ({ mutate: mockUpdate, isPending: false }),
  useDeleteComment: () => ({ mutate: mockDelete, isPending: false }),
}));
jest.mock('@/features/attachment/services/attachment.service', () => ({ uploadTaskAttachment: jest.fn() }));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import CommentInput from '@/features/comment/components/CommentInput';
import CommentItem from '@/features/comment/components/CommentItem';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { TaskComment } from '@/features/comment/types/comment';

const comment: TaskComment = {
  id: 'c1',
  content: 'Original comment',
  taskId: 't1',
  author: { id: 'u1', fullName: 'Sravani', email: 's@x.com', role: 'Employee' },
  createdAt: '2026-01-01',
};

describe('CommentInput', () => {
  beforeEach(() => jest.clearAllMocks());

  it('disables the button until there is content, then submits', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommentInput taskId="t1" />, { withRouter: false });
    const button = screen.getByRole('button', { name: 'Comment' });
    expect(button).toBeDisabled();

    await user.type(screen.getByRole('textbox'), 'Hello world');
    expect(button).toBeEnabled();
    await user.click(button);
    expect(mockAdd).toHaveBeenCalledWith('Hello world', expect.any(Object));
  });
});

describe('CommentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'Sravani', name: 'Sravani', email: 's@x.com', role: 'Employee', mustChangePassword: false },
      't',
    );
  });

  it('renders the comment and lets the author edit and save', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommentItem comment={comment} taskId="t1" />, { withRouter: false });
    expect(screen.getByText('Sravani')).toBeInTheDocument();

    await user.click(screen.getByRole('button')); // menu
    await user.click(await screen.findByText('Edit'));
    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Edited content');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockUpdate).toHaveBeenCalledWith({ id: 'c1', content: 'Edited content' }, expect.any(Object));
  });

  it('lets an author delete their comment', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommentItem comment={comment} taskId="t1" />, { withRouter: false });
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByText('Delete'));
    expect(mockDelete).toHaveBeenCalledWith('c1');
  });

  it('hides controls for a non-author non-admin', () => {
    useAuthStore.getState().login(
      { id: 'other', fullName: 'Other', name: 'Other', email: 'o@x.com', role: 'Employee', mustChangePassword: false },
      't',
    );
    renderWithProviders(<CommentItem comment={comment} taskId="t1" />, { withRouter: false });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
