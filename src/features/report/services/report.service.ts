import api from '@/shared/services/api';
import type { ReportOverview } from '../types/report';

export const getReportOverview = async (): Promise<ReportOverview> => {
  const { data } = await api.get<{
    success: boolean;
    data: ReportOverview;
  }>('/reports/overview');

  return data.data;
};
