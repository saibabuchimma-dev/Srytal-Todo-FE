import { Card, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Title order={5}>{title}</Title>

      {subtitle && (
        <Text size="xs" c="dimmed" mt={2}>
          {subtitle}
        </Text>
      )}

      <div style={{ marginTop: 14 }}>{children}</div>
    </Card>
  );
}
