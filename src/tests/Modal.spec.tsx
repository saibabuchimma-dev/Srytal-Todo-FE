import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import Modal from '@/shared/ui/Modal/Modal';

describe('Modal', () => {
  const renderModal = (props = {}) => {
    return render(
      <MantineProvider>
        <Modal
          opened={true}
          onClose={jest.fn()}
          size="md"
          radius="lg"
          centered={true}
          {...props}
        >
          Modal content
        </Modal>
      </MantineProvider>,
    );
  };

  it('renders modal content when opened', () => {
    renderModal();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { unmount } = render(
      <MantineProvider>
        <Modal opened={false} onClose={jest.fn()}>
          Modal content
        </Modal>
      </MantineProvider>,
    );
    unmount();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    renderModal();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = jest.fn();
    renderModal({ ref });
    expect(ref).toHaveBeenCalled();
  });

  it('passes additional props to MantineModal', () => {
    renderModal({ 'data-testid': 'custom-modal' });
    expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
  });

  it('renders modal with overlay when opened', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders modal header with close button', () => {
    renderModal();
    const closeButton = screen.getByRole('button', { name: '' });
    expect(closeButton).toBeInTheDocument();
  });

  it('applies size prop to modal root', () => {
    renderModal({ size: 'lg' });
    const modalRoot = document.querySelector('.mantine-Modal-root');
    expect(modalRoot).toBeInTheDocument();
  });

  it('applies radius prop to modal root', () => {
    renderModal({ radius: 'xl' });
    const modalRoot = document.querySelector('.mantine-Modal-root');
    expect(modalRoot).toBeInTheDocument();
  });
});
