const mockUseReport = jest.fn();
jest.mock('@/features/report/hooks/useReport', () => ({
  useReportOverview: () => mockUseReport(),
}));
jest.mock('@/features/report/components/StatusPieChart', () => ({ __esModule: true, default: () => <div>pie</div> }));
jest.mock('@/features/report/components/PriorityBarChart', () => ({ __esModule: true, default: () => <div>bar</div> }));
jest.mock('@/features/report/components/MonthlyTasksChart', () => ({ __esModule: true, default: () => <div>area</div> }));

import { renderWithProviders, screen } from '@test-utils';
import ReportsPage from '@/features/report/screens/ReportsPage';

const data = {
  totals: { totalTasks: 10, completed: 6, completionRate: 60, totalEmployees: 4 },
  statusDistribution: [],
  priorityDistribution: [],
  monthlyTasks: [],
};

describe('ReportsPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading', () => {
    mockUseReport.mockReturnValue({ isLoading: true });
    renderWithProviders(<ReportsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error when the request fails or returns no data', () => {
    mockUseReport.mockReturnValue({ isError: true, data: null });
    renderWithProviders(<ReportsPage />);
    expect(screen.getByText('Analytics could not be loaded.')).toBeInTheDocument();
  });

  it('renders totals and charts', () => {
    mockUseReport.mockReturnValue({ data, isLoading: false });
    renderWithProviders(<ReportsPage />);
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('pie')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('area')).toBeInTheDocument();
  });
});
