import { Card, Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: number;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card shadow="sm" radius="md" withBorder>
        <Text c="dimmed" size="sm">
          {title}
        </Text>
        <Title order={2}>{value}</Title>
      </Card>
    </motion.div>
  );
}
