import { Card, Group, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: string;
  hint?: string;
}

export default function StatsCard({
  label,
  value,
  icon,
  accent = 'var(--app-accent)',
  hint,
}: StatsCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
      <Card withBorder radius="lg" p="lg" h="100%">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 0.5 }}>
              {label}
            </Text>
            <Text fz={30} fw={800} lh={1.15} mt={8}>
              {value}
            </Text>
            {hint && (
              <Text size="xs" c="dimmed" mt={4}>
                {hint}
              </Text>
            )}
          </div>

          <div
            style={{
              flexShrink: 0,
              width: 46,
              height: 46,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              color: accent,
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
            }}
          >
            {icon}
          </div>
        </Group>
      </Card>
    </motion.div>
  );
}
