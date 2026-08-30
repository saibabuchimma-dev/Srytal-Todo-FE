export interface NameValue {
  name: string;
  value: number;
}

export interface MonthlyTask {
  month: string;
  count: number;
}

export interface ReportTotals {
  totalTasks: number;
  totalEmployees: number;
  completed: number;
  completionRate: number;
}

export interface ReportOverview {
  totals: ReportTotals;
  statusDistribution: NameValue[];
  priorityDistribution: NameValue[];
  monthlyTasks: MonthlyTask[];
}
