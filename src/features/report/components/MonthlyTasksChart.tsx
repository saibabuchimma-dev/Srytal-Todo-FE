import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { CHART_BLUE, CHART_INK } from '../constants/chart';
import type { MonthlyTask } from '../types/report';
import ChartTooltip from './ChartTooltip';

interface MonthlyTasksChartProps {
  data: MonthlyTask[];
}

export default function MonthlyTasksChart({ data }: MonthlyTasksChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_BLUE} stopOpacity={0.25} />
            <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={{ stroke: CHART_INK.baseline }}
          tick={{ fill: CHART_INK.axis, fontSize: 12 }}
        />

        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART_INK.axis, fontSize: 12 }}
          width={30}
        />

        <Tooltip
          cursor={{ stroke: CHART_INK.baseline, strokeDasharray: '3 3' }}
          content={<ChartTooltip />}
        />

        <Area
          type="monotone"
          dataKey="count"
          stroke={CHART_BLUE}
          strokeWidth={2}
          fill="url(#monthlyFill)"
          dot={{ r: 3, fill: CHART_BLUE, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
