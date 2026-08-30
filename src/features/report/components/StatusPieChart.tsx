import { Group, Text } from '@mantine/core';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { CHART_BLUE, CHART_INK, STATUS_COLORS } from '../constants/chart';
import type { NameValue } from '../types/report';
import ChartTooltip from './ChartTooltip';

interface StatusPieChartProps {
  data: NameValue[];
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={64}
            outerRadius={100}
            paddingAngle={2}
            stroke={CHART_INK.surface}
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? CHART_BLUE} />
            ))}
          </Pie>

          <Tooltip content={<ChartTooltip colorByName={STATUS_COLORS} />} />
        </PieChart>
      </ResponsiveContainer>

      <Group justify="center" gap="lg" mt="sm">
        {data.map((entry) => (
          <Group key={entry.name} gap={6} wrap="nowrap">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: STATUS_COLORS[entry.name] ?? CHART_BLUE,
                display: 'inline-block',
              }}
            />
            <Text size="xs" c="dimmed">
              {entry.name}
            </Text>
            <Text size="xs" fw={700}>
              {total ? `${entry.value} (${Math.round((entry.value / total) * 100)}%)` : entry.value}
            </Text>
          </Group>
        ))}
      </Group>
    </div>
  );
}
