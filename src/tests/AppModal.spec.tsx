import { renderWithProviders, screen, userEvent } from '@test-utils';
import AppModal from '@/shared/ui/Modal/AppModal';

describe('AppModal', () => {
  it('does not render content when closed', () => {
    renderWithProviders(
      <AppModal opened={false} onClose={jest.fn()} title="Hidden">
        <div>Body</div>
      </AppModal>,
      { withRouter: false },
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders title, subtitle, icon and children when open', () => {
    renderWithProviders(
      <AppModal
        opened
        onClose={jest.fn()}
        title="Create Project"
        subtitle="Set things up"
        icon={<span data-testid="icon" />}
      >
        <div>Form body</div>
      </AppModal>,
      { withRouter: false },
    );
    expect(screen.getByText('Create Project')).toBeInTheDocument();
    expect(screen.getByText('Set things up')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Form body')).toBeInTheDocument();
  });

  it('fires onClose from the header close button and the Cancel button', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithProviders(
      <AppModal opened onClose={onClose} title="T" onSubmit={jest.fn((e) => e.preventDefault())}>
        <div>b</div>
      </AppModal>,
      { withRouter: false },
    );
    await user.click(screen.getByRole('button', { name: /close/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('submits the form via the submit button', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn((e) => e.preventDefault());
    renderWithProviders(
      <AppModal opened onClose={jest.fn()} title="T" submitLabel="Save it" onSubmit={onSubmit}>
        <div>b</div>
      </AppModal>,
      { withRouter: false },
    );
    await user.click(screen.getByRole('button', { name: 'Save it' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('hides the footer when hideFooter is set', () => {
    renderWithProviders(
      <AppModal opened onClose={jest.fn()} title="T" hideFooter>
        <div>b</div>
      </AppModal>,
      { withRouter: false },
    );
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('applies a submitColor without the gradient override', () => {
    renderWithProviders(
      <AppModal opened onClose={jest.fn()} title="T" submitColor="red" onSubmit={jest.fn((e) => e.preventDefault())}>
        <div>b</div>
      </AppModal>,
      { withRouter: false },
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
