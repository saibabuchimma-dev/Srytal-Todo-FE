import { renderWithProviders, screen } from '@test-utils';
import Loader from '@/styles/loader';

describe('Loader', () => {
  it('renders the default label with a status role', () => {
    renderWithProviders(<Loader />, { withRouter: false });
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('Loading');
  });

  it('honours a custom label, size and fullScreen', () => {
    renderWithProviders(<Loader label="Please wait" size={60} fullScreen />, { withRouter: false });
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });
});
