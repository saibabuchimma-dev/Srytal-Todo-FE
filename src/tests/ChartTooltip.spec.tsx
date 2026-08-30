import { render, renderWithProviders, screen } from '@test-utils';
import ChartTooltip from '@/features/report/components/ChartTooltip';

describe('ChartTooltip', () => {
  it('renders nothing when inactive or empty', () => {
    const { container: c1 } = render(<ChartTooltip active={false} payload={[{ value: 1 }]} />);
    expect(c1).toBeEmptyDOMElement();
    const { container: c2 } = render(<ChartTooltip active payload={[]} />);
    expect(c2).toBeEmptyDOMElement();
  });

  it('shows the axis label header and named entries', () => {
    renderWithProviders(
      <ChartTooltip active label="January" payload={[{ name: 'Completed', value: 12, color: '#123456' }]} />,
      { withRouter: false },
    );
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('derives the header from the payload when no axis label is present', () => {
    renderWithProviders(
      <ChartTooltip active payload={[{ name: 'Pending', value: 3, payload: { name: 'Pending', fill: '#abc' } }]} />,
      { withRouter: false },
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides generic value/count names and falls back to colorByName', () => {
    renderWithProviders(
      <ChartTooltip active label="Week 1" payload={[{ name: 'value', value: 7 }]} colorByName={{ 'Week 1': '#f00' }} />,
      { withRouter: false },
    );
    expect(screen.queryByText('value')).not.toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
