import { renderWithProviders, screen, userEvent } from '@test-utils';
import ThemeToggle from '@/shared/ui/ThemeToggle/ThemeToggle';

describe('ThemeToggle', () => {
  it('renders a toggle button (defaults to dark-mode affordance in light scheme)', () => {
    renderWithProviders(<ThemeToggle />, { withRouter: false });
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('toggles the color scheme label when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />, { withRouter: false });

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(button);

    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it('supports the chip variant', () => {
    renderWithProviders(<ThemeToggle chip size={32} />, { withRouter: false });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
