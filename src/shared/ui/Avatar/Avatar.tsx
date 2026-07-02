import { Avatar as MantineAvatar } from '@mantine/core';
import type { AvatarProps } from '@mantine/core';

export default function Avatar(props: AvatarProps) {
  return <MantineAvatar radius="xl" color="blue" {...props} />;
}
