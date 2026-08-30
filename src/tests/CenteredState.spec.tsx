import { renderWithProviders, screen } from '@test-utils';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';

describe('CenteredState', () => {
  it('renders a loader in the loading variant (default)', () => {
    renderWithProviders(<CenteredState />, { withRouter: false });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the default empty message', () => {
    renderWithProviders(<CenteredState variant="empty" />, { withRouter: false });
    expect(screen.getByText('No data to show.')).toBeInTheDocument();
  });

  it('renders the default error message', () => {
    renderWithProviders(<CenteredState variant="error" />, { withRouter: false });
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('renders a custom message and a custom icon', () => {
    renderWithProviders(
      <CenteredState variant="empty" message="Nothing here" icon={<span data-testid="ic" />} minHeight={200} />,
      { withRouter: false },
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByTestId('ic')).toBeInTheDocument();
  });
});
