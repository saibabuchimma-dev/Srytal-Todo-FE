import { Card, Text, Title } from '@mantine/core';

interface Props {
  title: string;
  value: number;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <Card shadow="sm" radius="lg" withBorder>
      <Text c="dimmed">{title}</Text>
      <Title order={2}>{value}</Title>
    </Card>
  );
}
