import { renderWithProviders, screen } from '@test-utils';
import Surface from '@/shared/ui/Surface/Surface';

// Note: Surface styles use CSS custom properties (var(--app-*)). jsdom's CSSOM
// drops var()-based values, so these tests exercise both prop branches and
// assert structure/children rather than resolved style strings.
describe('Surface', () => {
  it('renders children with the base surface + border by default', () => {
    renderWithProviders(
      <Surface>
        <span>content</span>
      </Surface>,
      { withRouter: false },
    );
    const el = screen.getByText('content').parentElement as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el).toContainHTML('<span>content</span>');
  });

  it('renders the raised level without a border and merges custom style', () => {
    renderWithProviders(
      <Surface level="raised" withBorder={false} style={{ padding: 4 }}>
        <span>raised</span>
      </Surface>,
      { withRouter: false },
    );
    const el = screen.getByText('raised').parentElement as HTMLElement;
    expect(el.style.padding).toBe('4px');
    expect(el.style.border).toBe('');
  });
});
