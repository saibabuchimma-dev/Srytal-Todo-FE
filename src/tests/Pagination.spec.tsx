import { renderWithProviders, screen, userEvent } from '@test-utils';
import Pagination from '@/shared/ui/Pagination/Pagination';

describe('Pagination', () => {
  it('renders nothing when there are no items', () => {
    renderWithProviders(
      <Pagination page={1} total={0} limit={10} onPageChange={jest.fn()} />,
      { withRouter: false },
    );
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it('shows the "Showing X–Y of Z" summary', () => {
    renderWithProviders(
      <Pagination page={2} total={45} limit={10} onPageChange={jest.fn()} />,
      { withRouter: false },
    );
    expect(screen.getByText(/Showing 11–20 of 45/)).toBeInTheDocument();
  });

  it('clamps the upper bound to the total on the last page', () => {
    renderWithProviders(
      <Pagination page={5} total={42} limit={10} onPageChange={jest.fn()} />,
      { withRouter: false },
    );
    expect(screen.getByText(/Showing 41–42 of 42/)).toBeInTheDocument();
  });

  it('calls onPageChange when a page control is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    renderWithProviders(
      <Pagination page={1} total={30} limit={10} onPageChange={onPageChange} />,
      { withRouter: false },
    );
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders the rows-per-page selector when onLimitChange is provided', () => {
    renderWithProviders(
      <Pagination
        page={1}
        total={30}
        limit={10}
        onPageChange={jest.fn()}
        onLimitChange={jest.fn()}
      />,
      { withRouter: false },
    );
    expect(screen.getByDisplayValue('10 / page')).toBeInTheDocument();
  });
});
