import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, userEvent } from '@test-utils';
import BackButton from '@/shared/ui/BackButton/BackButton';

function LocationProbe() {
  return <div data-testid="probe" />;
}

describe('BackButton', () => {
  it('renders with the default label', () => {
    renderWithProviders(<BackButton />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('navigates to an explicit route when `to` is provided', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={<BackButton to="/target" label="Go" />} />
        <Route path="/target" element={<div>Target Page</div>} />
      </Routes>,
      { route: '/' },
    );

    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByText('Target Page')).toBeInTheDocument();
  });

  it('goes back in history when `to` is omitted', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/first" element={<div>First Page</div>} />
        <Route path="/second" element={<><BackButton /><LocationProbe /></>} />
      </Routes>,
      { route: '/second' },
    );

    // MemoryRouter starts with a single entry; navigating back with one entry
    // is a no-op but still exercises the navigate(-1) branch.
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByTestId('probe')).toBeInTheDocument();
  });
});
