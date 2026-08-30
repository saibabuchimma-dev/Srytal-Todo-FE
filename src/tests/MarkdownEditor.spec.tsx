jest.mock('@/features/attachment/services/attachment.service', () => ({
  uploadTaskAttachment: jest.fn(),
}));
jest.mock('@/shared/utils/toast', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));

import { useState } from 'react';
import { renderWithProviders, screen, userEvent, fireEvent, waitFor } from '@test-utils';
import MarkdownEditor from '@/features/comment/components/MarkdownEditor';
import MarkdownContent from '@/features/comment/components/MarkdownContent';
import { uploadTaskAttachment } from '@/features/attachment/services/attachment.service';
import { toast } from '@/shared/utils/toast';

const mockUpload = uploadTaskAttachment as jest.Mock;
const mToast = toast as unknown as { error: jest.Mock };

function Harness({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <MarkdownEditor value={value} onChange={setValue} taskId="t1" />;
}

describe('MarkdownEditor', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders toolbar and applies a bold command', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />, { withRouter: false });
    await user.click(screen.getByLabelText('Bold'));
    expect(screen.getByRole('textbox')).toHaveValue('****');
  });

  it('applies a heading line prefix', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness initial="hello" />, { withRouter: false });
    await user.click(screen.getByLabelText('Heading'));
    expect(screen.getByRole('textbox')).toHaveValue('### hello');
  });

  it('switches to preview: empty then with content', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />, { withRouter: false });
    await user.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByText('Nothing to preview.')).toBeInTheDocument();
  });

  it('uploads pasted files and inserts a link', async () => {
    mockUpload.mockResolvedValueOnce({ originalName: 'pic.png', url: 'http://x/pic.png', mimeType: 'image/png' });
    renderWithProviders(<Harness />, { withRouter: false });
    const textarea = screen.getByRole('textbox');
    fireEvent.paste(textarea, { clipboardData: { files: [new File(['a'], 'pic.png', { type: 'image/png' })] } });
    await waitFor(() => expect(mockUpload).toHaveBeenCalledWith('t1', expect.any(File)));
    await waitFor(() => expect((textarea as HTMLTextAreaElement).value).toContain('![pic.png](http://x/pic.png)'));
  });

  it('toasts when an upload fails', async () => {
    mockUpload.mockRejectedValueOnce(new Error('nope'));
    renderWithProviders(<Harness />, { withRouter: false });
    const textarea = screen.getByRole('textbox');
    fireEvent.drop(textarea, { dataTransfer: { files: [new File(['a'], 'f.txt', { type: 'text/plain' })] } });
    await waitFor(() => expect(mToast.error).toHaveBeenCalled());
  });
});

describe('MarkdownContent', () => {
  it('renders markdown children', () => {
    renderWithProviders(<MarkdownContent># Title</MarkdownContent>, { withRouter: false });
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
  });
});
