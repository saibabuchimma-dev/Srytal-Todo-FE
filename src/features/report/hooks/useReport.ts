import { useQuery } from '@tanstack/react-query';

import { getReportOverview } from '../services/report.service';

export const useReportOverview = () =>
  useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: getReportOverview,
  });
