jest.mock('@/features/report/services/report.service', () => ({ getReportOverview: jest.fn() }));

import { renderWithProviders, screen, renderHook, waitFor, hookWrapper } from '@test-utils';
import ChartCard from '@/features/report/components/ChartCard';
import StatusPieChart from '@/features/report/components/StatusPieChart';
import PriorityBarChart from '@/features/report/components/PriorityBarChart';
import MonthlyTasksChart from '@/features/report/components/MonthlyTasksChart';
import { useReportOverview } from '@/features/report/hooks/useReport';
import { getReportOverview } from '@/features/report/services/report.service';

describe('ChartCard', () => {
  it('renders title, subtitle and children', () => {
    renderWithProviders(
      <ChartCard title="Task Status" subtitle="By status">
        <div>chart-body</div>
      </ChartCard>,
      { withRouter: false },
    );
    expect(screen.getByText('Task Status')).toBeInTheDocument();
    expect(screen.getByText('By status')).toBeInTheDocument();
    expect(screen.getByText('chart-body')).toBeInTheDocument();
  });
});

describe('report charts render without crashing', () => {
  it('StatusPieChart renders a legend', () => {
    renderWithProviders(
      <StatusPieChart data={[{ name: 'Completed', value: 6 }, { name: 'Pending', value: 4 }]} />,
      { withRouter: false },
    );
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText(/6 \(60%\)/)).toBeInTheDocument();
  });

  it('StatusPieChart handles an all-zero total', () => {
    renderWithProviders(<StatusPieChart data={[{ name: 'Pending', value: 0 }]} />, { withRouter: false });
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('PriorityBarChart and MonthlyTasksChart mount', () => {
    const { container: c1 } = renderWithProviders(
      <PriorityBarChart data={[{ name: 'High', value: 3 }]} />,
      { withRouter: false },
    );
    expect(c1.firstChild).toBeTruthy();

    const { container: c2 } = renderWithProviders(
      <MonthlyTasksChart data={[{ month: 'Jan', count: 2 }]} />,
      { withRouter: false },
    );
    expect(c2.firstChild).toBeTruthy();
  });
});

describe('useReportOverview', () => {
  it('fetches the overview', async () => {
    (getReportOverview as jest.Mock).mockResolvedValueOnce({ totals: {} });
    const { result } = renderHook(() => useReportOverview(), hookWrapper());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
