import { renderWithProviders, screen } from '@test-utils';
import Avatar from '@/shared/ui/Avatar/Avatar';
import Badge from '@/shared/ui/Badge/Badge';
import Button from '@/shared/ui/Button/Button';
import Card from '@/shared/ui/Card/Card';
import Input from '@/shared/ui/Input/Input';

describe('UI primitive wrappers', () => {
  it('Avatar renders initials/content', () => {
    renderWithProviders(<Avatar>AB</Avatar>, { withRouter: false });
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('Badge renders its label', () => {
    renderWithProviders(<Badge>New</Badge>, { withRouter: false });
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('Button renders and forwards props', () => {
    renderWithProviders(<Button data-testid="btn">Click</Button>, { withRouter: false });
    expect(screen.getByTestId('btn')).toHaveTextContent('Click');
  });

  it('Card renders children', () => {
    renderWithProviders(<Card>Panel</Card>, { withRouter: false });
    expect(screen.getByText('Panel')).toBeInTheDocument();
  });

  it('Input renders with a label', () => {
    renderWithProviders(<Input label="Email" placeholder="you@x.com" />, { withRouter: false });
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
