import { Badge as MantineBadge } from '@mantine/core';
import type { BadgeProps } from '@mantine/core';

export default function Badge(props: BadgeProps) {
  return <MantineBadge radius="sm" variant="light" {...props} />;
}
