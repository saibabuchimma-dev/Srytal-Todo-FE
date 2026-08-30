const mockDelete = jest.fn();
jest.mock('@/features/attachment/hooks/useAttachments', () => ({
  useDeleteAttachment: () => ({ mutate: mockDelete, isPending: false }),
}));

import { renderWithProviders, screen, userEvent } from '@test-utils';
import AttachmentItem from '@/features/attachment/components/AttachmentItem';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Attachment } from '@/features/attachment/types/attachment';

const attachment: Attachment = {
  id: 'f1',
  originalName: 'report.pdf',
  fileName: 'report.pdf',
  mimeType: 'application/pdf',
  size: 2048,
  url: 'http://x/report.pdf',
  taskId: 't1',
  uploadedBy: { id: 'u1', fullName: 'Sravani', role: 'Employee' },
  createdAt: '2026-01-01',
};

describe('AttachmentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().login(
      { id: 'u1', fullName: 'Sravani', name: 'Sravani', email: 's@x.com', role: 'Employee', mustChangePassword: false },
      't',
    );
  });

  it('renders the name, formatted size and uploader', () => {
    renderWithProviders(<AttachmentItem attachment={attachment} taskId="t1" />, { withRouter: false });
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText(/2\.0 KB · Sravani/)).toBeInTheDocument();
  });

  it('formats a zero-byte file', () => {
    renderWithProviders(<AttachmentItem attachment={{ ...attachment, size: 0 }} taskId="t1" />, { withRouter: false });
    expect(screen.getByText(/0 B/)).toBeInTheDocument();
  });

  it('lets the uploader delete', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AttachmentItem attachment={attachment} taskId="t1" />, { withRouter: false });
    // open the menu (last action icon)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 1]);
    await user.click(await screen.findByText('Delete'));
    expect(mockDelete).toHaveBeenCalledWith('f1');
  });

  it('hides delete for a non-uploader non-admin', () => {
    useAuthStore.getState().login(
      { id: 'other', fullName: 'O', name: 'O', email: 'o@x.com', role: 'Employee', mustChangePassword: false },
      't',
    );
    renderWithProviders(<AttachmentItem attachment={attachment} taskId="t1" />, { withRouter: false });
    // download link still present, but no menu delete
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
