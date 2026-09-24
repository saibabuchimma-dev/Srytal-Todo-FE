import {
  Avatar as MantineAvatar,
  type AvatarProps as MantineAvatarProps,
} from '@mantine/core';
import { forwardRef } from 'react';

export type AvatarProps = MantineAvatarProps;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { children, src, size = 'md', radius = 'xl', color = 'blue', ...props },
    ref,
  ) => {
    return (
      <MantineAvatar
        ref={ref}
        radius={radius}
        size={size}
        color={color}
        src={src}
        {...props}
      >
        {children}
      </MantineAvatar>
    );
  },
);

Avatar.displayName = 'Avatar';
export default Avatar;
