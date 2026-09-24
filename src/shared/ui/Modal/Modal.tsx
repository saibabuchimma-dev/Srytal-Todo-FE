import {
  Modal as MantineModal,
  type ModalProps as MantineModalProps,
} from '@mantine/core';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';

export interface ModalProps extends MantineModalProps {
  children?: ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      opened,
      onClose,
      size = 'md',
      radius = 'lg',
      centered = true,
      ...props
    },
    ref,
  ) => {
    return (
      <MantineModal
        ref={ref}
        opened={opened}
        onClose={onClose}
        size={size}
        radius={radius}
        centered={centered}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 4,
        }}
        transitionProps={{
          transition: 'pop',
          duration: 180,
        }}
        {...props}
      >
        {children}
      </MantineModal>
    );
  },
);

Modal.displayName = 'Modal';
export default Modal;
