import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { CHART_BLUE, CHART_INK, PRIORITY_COLORS } from '../constants/chart';
import type { NameValue } from '../types/report';
import ChartTooltip from './ChartTooltip';

interface PriorityBarChartProps {
  data: NameValue[];
}

export default function PriorityBarChart({ data }: PriorityBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />

        <XAxis
          dataKey="name"
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
          cursor={{ fill: CHART_INK.cursor }}
          content={<ChartTooltip colorByName={PRIORITY_COLORS} />}
        />

        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] ?? CHART_BLUE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
